const User = require("../models/User");
const Chat = require("../models/Chat");
const { getIntentAndEntities } = require("../llm/langchainGemini");

const { AlarmAgent } = require("../agents/alarmAgent");
const { ReminderAgent } = require("../agents/reminderAgent");
const { EmailAgent } = require("../agents/emailAgent");
const { WeatherAgent } = require("../agents/weatherAgent");
const { ToDoAgent } = require("../agents/todoAgent");
const { ChatAgent } = require("../agents/chatAgent");
const { CalendarAgent } = require("../agents/calenderAgent");
const { parseCalendarInfo } = require('../utils/parseDateTime');

const moment = require("moment");

const pendingTasks = new Map();

const Task = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Text is required." });
  }

  const normalized = text.trim().toLowerCase();

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (normalized === "confirm") {
      const pending = pendingTasks.get(userId);
      if (pending?.status === "requires_confirmation") {
        const { intent, info } = pending;
        let reply = "";

        try {
          switch (intent) {
            case "reminder":
              reply = await ReminderAgent(userId, info);
              break;
            case "alarm":
              reply = await AlarmAgent(userId, info);
              break;
            case "email":
              reply = await EmailAgent(userId, info);
              break;
            case "weather":
              reply = await WeatherAgent(userId, info);
              break;
            case "todo":
              if (!info.task && info.message) info.task = info.message;
              reply = await ToDoAgent(userId, info);
              break;
            case "calendar":
              info = parseCalendarInfo(info);
              const calendarResult = await CalendarAgent(userId, info);
              reply = calendarResult.message;

              if (info.sendTo && calendarResult.meetLink) {
                const recipient = user.contacts.find(
                  c => c.name.toLowerCase() === info.sendTo.toLowerCase()
                );
                if (recipient?.email) {
                  const emailInfo = {
                    to: recipient.email,
                    subject: `Google Meet: ${info.title}`,
                    body: `Hi ${recipient.name},\n\nYou're invited to a meeting: "${info.title}".\n\nJoin: ${calendarResult.meetLink}\n\nRegards,\n${user.full_name || "Bot"}`,
                  };
                  await EmailAgent(userId, emailInfo);
                  reply += `\n📨 Sent Meet link to ${recipient.name} (${recipient.email})`;
                } else {
                  reply += `\n⚠️ Contact "${info.sendTo}" not found or missing email.`;
                }
              }

              break;
            case "chat":
            default:
              reply = await ChatAgent(userId, info);
          }

          pendingTasks.delete(userId);
          await saveToChat(userId, "confirm", reply);

          return res.json({
            status: "ok",
            results: [{ intent, info, status: "success", reply }],
          });
        } catch (err) {
          return res.status(500).json({
            message: `Failed to execute confirmed task: ${err.message}`,
          });
        }
      }

      const fallbackMsg = "⚠️ There’s nothing pending confirmation.";
      await saveToChat(userId, text, fallbackMsg);
      return res.json({
        status: "ok",
        results: [{
          intent: "chat",
          info: { message: text },
          status: "fallback",
          reply: fallbackMsg,
        }],
      });
    }

    const last = pendingTasks.get(userId);
    let actions = [];

    if (last?.status === "missing_info" && last.missing.length > 0) {
      const field = last.missing.shift();
      last.info[field] = text;
      actions = [last];
      pendingTasks.delete(userId);
    } else {
      try {
        actions = await getIntentAndEntities(text);
      } catch (err) {
        console.warn("⚠️ Fallback to chat due to LLM error.");
      }
    }

    if (!Array.isArray(actions) || actions.length === 0) {
      actions = [{ intent: "chat", info: { message: text } }];
    }

    const results = [];
    let finalBotReply = "";

    for (const action of actions) {
      const { intent, confirm } = action;
      let info = action.info || {};

      if (["email", "whatsapp"].includes(intent) && typeof info.to === "string") {
        const contact = user.contacts.find(
          c => c.name.toLowerCase() === info.to.toLowerCase()
        );
        if (contact) {
          if (intent === "email" && contact.email) info.to = contact.email;
          if (intent === "whatsapp" && contact.phone) info.to = contact.phone;
        }
      }

      if (info.missing && info.missing.length > 0) {
        pendingTasks.set(userId, {
          intent,
          info,
          status: "missing_info",
          missing: [...info.missing],
        });

        const missingMsg = `⚠️ Missing fields: ${info.missing.join(", ")}`;
        results.push({ intent, info, status: "missing_info", missing: info.missing });
        finalBotReply += (finalBotReply ? "\n" : "") + missingMsg;
        continue;
      }

      if (confirm) {
        pendingTasks.set(userId, {
          intent,
          info,
          status: "requires_confirmation",
        });

        const confirmationText = `⚠️ Please confirm the following ${intent}:\n${JSON.stringify(info, null, 2)}`;
        results.push({
          intent,
          info,
          status: "requires_confirmation",
          requireConfirmation: true,
        });

        finalBotReply += (finalBotReply ? "\n" : "") + confirmationText;
        continue;
      }

      try {
        let reply = "";
        switch (intent) {
          case "reminder":
            reply = await ReminderAgent(userId, info);
            break;
          case "alarm":
            reply = await AlarmAgent(userId, info);
            break;
          case "email":
            reply = await EmailAgent(userId, info);
            break;
          case "weather":
            reply = await WeatherAgent(userId, info);
            break;
          case "todo":
            if (!info.task && info.message) info.task = info.message;
            reply = await ToDoAgent(userId, info);
            break;
          case "calendar":
            info = parseCalendarInfo(info);
            const result = await CalendarAgent(userId, info);
            reply = result.message;

            if (info.sendTo && result.meetLink) {
              const recipient = user.contacts.find(
                c => c.name.toLowerCase() === info.sendTo.toLowerCase()
              );
              if (recipient?.email) {
                const emailInfo = {
                  to: recipient.email,
                  subject: `Google Meet: ${info.title}`,
                  body: `Hi ${recipient.name},\n\nYou're invited to a meeting: "${info.title}".\n\nJoin: ${result.meetLink}\n\nRegards,\n${user.full_name || "Bot"}`,
                };
                await EmailAgent(userId, emailInfo);
                reply += `\n📨 Sent Meet link to ${recipient.name} (${recipient.email})`;
              } else {
                reply += `\n⚠️ Contact "${info.sendTo}" not found or missing email.`;
              }
            }

            break;
          case "chat":
          default:
            reply = await ChatAgent(userId, info);
        }

        results.push({ intent, info, status: "success", reply });
        finalBotReply += (finalBotReply ? "\n" : "") + reply;
      } catch (err) {
        const errMsg = `❌ Error: ${err.message}`;
        results.push({ intent, info, status: "failed", error: err.message });
        finalBotReply += (finalBotReply ? "\n" : "") + errMsg;
      }
    }

    await saveToChat(userId, text, finalBotReply);
    return res.json({ status: "ok", results });

  } catch (err) {
    console.error("❌ [Task] Unhandled error:", err);
    return res.status(500).json({ message: err.message });
  }
};

const ping = (req, res) => res.status(200).send("API is alive 🚀");

async function saveToChat(userId, userText, botText) {
  let chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });

  if (!chat) {
    chat = await Chat.create({
      userId,
      messages: [],
    });
  }

  const messages = chat.messages;
  const len = messages.length;

  const lastUser = len >= 2 ? messages[len - 2] : null;
  const lastBot = len >= 1 ? messages[len - 1] : null;

  const isDuplicatePair =
    lastUser?.sender === "user" &&
    lastUser?.text.trim() === userText.trim() &&
    lastBot?.sender === "assistant" &&
    lastBot?.text.trim() === botText.trim();

  if (!isDuplicatePair) {
    chat.messages.push(
      { sender: "user", text: userText.trim() },
      { sender: "assistant", text: botText.trim() }
    );
    await chat.save();
    console.log("✅ chat set successfully:", userText);
  } else {
    console.log("⛔ Skipped duplicate message pair.");
  }
}

module.exports = { Task, ping };
