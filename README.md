# 🔮 llm-workflow-agent

An AI-powered task automation assistant that understands Hindi‑English mixed language.  
It can set reminders, alarms, send emails, fetch weather, create todos, schedule Google Calendar events (with Meet links), and more via a single `/api/task` endpoint.

---

## 📁 Project Structure

/
├── backend
│ ├── agents/ # Task‑specific logic (emailAgent, calendarAgent, etc.)
│ ├── controllers/ # Express route handlers
│ ├── llm/ # LangChain + Gemini integration & prompts
│ │ └── prompts/ # .txt prompt templates
│ ├── middlewares/ # auth, error‑handling, etc.
│ ├── models/ # Mongoose schemas (User, Chat, Reminder…)
│ ├── routes/ # Express routers (auth, task, chat, google…)
│ ├── scheduler/ # Re‑scheduling logic for reminders
│ ├── utils/ # Helpers (date‑parser, googleOAuth client…)
│ ├── .env # Backend env (NOT committed)
│ ├── package.json
│ └── server.js
│
├── frontend
│ ├── public/ # Static files (index.html, favicon…)
│ ├── src/ # React/Vite source
│ ├── .env # Frontend env (NOT committed)
│ ├── package.json
│ └── vite.config.js
│
├── .gitignore # Ignored files/folders
├── README.md # ← You’re here!
└── LICENSE # (optional)

yaml
Copy
Edit

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/jeetgoyal80/llm-workflow-agent.git
cd llm-workflow-agent
Backend
bash
Copy
Edit
cd backend
npm install
cp .env.example .env
# ── then edit .env, set:
# MONGO_URI=...
# JWT_SECRET=...
# GEMINI_API_KEY=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback
npm run dev
Your backend will run on http://localhost:4000.

Frontend
In a new terminal:

bash
Copy
Edit
cd frontend
npm install
cp .env.example .env
# ── then edit .env, set:
# VITE_API_BASE_URL=http://localhost:4000
npm run dev
Your frontend will run on http://localhost:5173.

🧩 How It Works
User types a natural‑language command in the UI.

Frontend sends { text: "...", chatId, confirmed } to POST /api/task.

LangChain‑Gemini agent extracts one or more intents + info from the text.

Your Task Controller:

Fills missing info

Awaits confirmation if needed

Dispatches to the right Agent:

ReminderAgent → saves & schedules in MongoDB + Socket.IO

CalendarAgent → calls Google Calendar & Meet APIs

EmailAgent → sends via Nodemailer

WeatherAgent → fetches from a weather API

ToDoAgent → saves todos

ChatAgent → LLM fallback conversation

Responses are saved in the Chat model and emitted back to the frontend.

🔑 Environment Variables
Backend (backend/.env)
dotenv
Copy
Edit
PORT=4000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL=your_smtp_email          # for dev/fallback
EMAIL_PASS=your_smtp_password  # for dev/fallback
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback
Frontend (frontend/.env)
dotenv
Copy
Edit
VITE_API_BASE_URL=http://localhost:4000
🛠️ Available Scripts
Backend
npm run dev – run with nodemon

npm start – run production build

Frontend
npm run dev – start Vite dev server

npm run build – build for production

npm run preview – preview production build locally

📚 Further Reading
LangChain: https://github.com/langchain-ai/langchain

Google Generative AI: use @langchain/google-genai

Mongoose: https://mongoosejs.com

Socket.IO: for real‑time notifications

Nodemailer: for sending emails

🤝 Contributing
Fork it

Create your feature branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m "feat: add YourFeature"

Push to the branch: git push origin feature/YourFeature

Open a Pull Request

📜 License
This project is licensed under the MIT License — see the LICENSE file for details.

Made with 💡 by Jeet Goyal © 2025

vbnet
Copy
Edit

—you can adjust any paths, env names or port numbers to match your setup. Let me know if you need tweaks!
