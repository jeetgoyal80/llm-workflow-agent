const twilio = require("twilio");
const User = require("../models/User");

const isDev = (process.env.NODE_ENV || "development") !== "production";

async function WhatsAppAgent(userId, info) {
  const { to, message } = info;
  console.log(info.message);
  

  // 🛡️ 1. Fetch user from DB
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  // 🧠 2. Determine credentials: prefer user config, fallback to .env in dev
  const useUserCreds = user.whatsapp?.sid?.startsWith("AC") &&
                       user.whatsapp?.token?.length > 10 &&
                       user.whatsapp?.from?.startsWith("+");

  const sid = useUserCreds ? user.whatsapp.sid : process.env.TWILIO_SID;
  const token = useUserCreds ? user.whatsapp.token : process.env.TWILIO_TOKEN;
  const from = useUserCreds ? user.whatsapp.from : process.env.TWILIO_FROM;

  // 🧪 Debug logs
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("👤 user.whatsapp:", user.whatsapp);
  console.log("📦 Final WhatsApp Config:", { sid, token, from });
  console.log("📤 Twilio Payload:", {
    from: `whatsapp:${from}`,
    to: `whatsapp:${to}`,
    body: message
  });

  // 🔐 3. Validate creds
  if (!sid || !token || !from) {
    throw new Error("WhatsApp credentials not connected for this user or environment.");
  }

  // if (isDev && !useUserCreds) {
  //   console.log("⚠️ Using fallback Twilio credentials from .env for:", user.email);
  // }

  // ✅ 4. Send WhatsApp message
  const client = twilio(sid, token);

  await client.messages.create({
    from: `whatsapp:${from}`,
    to: `whatsapp:${to}`,
    body: message
  });

  return `📲 WhatsApp message sent to ${to}`;
}

module.exports = { WhatsAppAgent };
