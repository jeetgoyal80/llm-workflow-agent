// agents/chatAgent.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash",
  maxOutputTokens: 512,
  temperature: 0.7,
  apiKey: process.env.GEMINI_API_KEY,
});

async function ChatAgent(userId, info) {
  const userMessage = info.message || "Hi";
  const res = await model.invoke(userMessage);
  return res.content || "I'm here to help!";
}

module.exports = { ChatAgent };
