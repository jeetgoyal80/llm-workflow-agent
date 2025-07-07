
# 🔮 llm-workflow-agent

An AI‑powered workflow assistant that understands Hindi–English mixed prompts and automates tasks like:
- Setting reminders & alarms  
- Sending emails  
- Fetching weather  
- Creating todos  
- Scheduling Google Calendar events (with Meet links)


## 📖 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Usage](#-usage)
6. [Environment Variables](#-environment-variables)
7. [Available Scripts](#-available-scripts)
8. [Contributing](#-contributing)
9. [License](#-license)

## 🚀 Features

- 🗣️ Hindi–English mixed‑language understanding  
- 🔔 Reminders & alarms  
- 📧 Smart email composition & sending  
- ☀️ Weather queries for any city  
- ✅ Todo creation & management  
- 🗓️ Google Calendar events + Meet links  
- 💬 LLM chat fallback for general conversation


## 🧩 Tech Stack

- **Backend:** Node.js, Express.js  
- **AI Model:** LangChain + Gemini (Google Generative AI)  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT & session middleware  
- **Email:** Nodemailer  
- **Calendar & Meet:** Google Calendar API  
- **Frontend:** React, Vite, Tailwind CSS  
- **Realtime:** Socket.IO (for reminders)

## 📁 Project Structure

/
├── backend
│ ├── agents/ # Task logic (email, calendar, etc.)
│ ├── controllers/ # Express handlers
│ ├── llm/ # Gemini integration & prompts
│ ├── middlewares/ # auth, error handling
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── scheduler/ # Reminder rescheduling
│ ├── utils/ # Helpers (date parsing, OAuth)
│ └── server.js
│
├── frontend
│ ├── public/ # index.html, icons
│ ├── src/ # React components & pages
│ └── vite.config.js
│
├── .gitignore
└── README.md

## 📁 Project setup

## Backend Setup

cd backend
npm install
cp .env.example .env
# Edit .env with your values:
# MONGO_URI=...
# JWT_SECRET=...
# GEMINI_API_KEY=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback
npm run dev

## Frontend Setup

cd frontend
npm install
cp .env.example .env
# Edit .env:
# VITE_API_BASE_URL=http://localhost:4000
npm run dev

## Usage

{
  "text": "Create a Google Meet with team Friday 5 PM and email boss",
  "chatId": "<existingChatId>",
  "confirmed": false
}

##  Environment Variables

## backend/.env  

PORT=4000
MONGO_URI=<mongo‑uri>
JWT_SECRET=<secret>
GEMINI_API_KEY=<key>
EMAIL=<smtp_email>      # dev fallback
EMAIL_PASS=<smtp_pass>  
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback

## frontend/.env

VITE_API_BASE_URL=http://localhost:4000

## Available Scripts

## Backend

npm run dev — start with nodemon

npm start — production

## Frontend

npm run dev — Vite dev server

npm run build — production build

npm run preview — preview build

## Contributing

git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature

## License


---

Copy each block into your `README.md`, in order. You can then tweak wording, add badges, or adjust ports/paths to your exact setup.
