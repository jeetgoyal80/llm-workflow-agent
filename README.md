# 🔮 llm-workflow-agent

An AI‑powered workflow assistant that understands Hindi–English mixed prompts and automates tasks like:
- Setting reminders & alarms  
- Sending emails  
- Fetching weather  
- Creating todos  
- Scheduling Google Calendar events (with Meet links)

---

## 📖 Table of Contents

1. [Features](#🚀-features)  
2. [Tech Stack](#🧩-tech-stack)  
3. [Project Structure](#📁-project-structure)  
4. [Getting Started](#🚀-getting-started)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
5. [Usage](#🛠️-usage)  
6. [Environment Variables](#🔑-environment-variables)  
7. [Available Scripts](#📦-available-scripts)  
8. [Contributing](#🤝-contributing)  
9. [License](#📜-license)  

---

## 🚀 Features

- 🗣️ Hindi–English mixed‑language understanding  
- 🔔 Reminders & alarms  
- 📧 Smart email composition & sending  
- ☀️ Weather queries for any city  
- ✅ Todo creation & management  
- 🗓️ Google Calendar events + Meet links  
- 💬 LLM chat fallback for general conversation  

---

## 🧩 Tech Stack

- **Backend:** Node.js, Express.js  
- **AI Model:** LangChain + Gemini (Google Generative AI)  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT & session middleware  
- **Email:** Nodemailer  
- **Calendar & Meet:** Google Calendar API  
- **Frontend:** React, Vite, Tailwind CSS  
- **Realtime:** Socket.IO (for reminders)  

```
nl_task_automator/
├── backend/
│ ├── agents/ # Task logic modules (email, calendar, etc.)
│ ├── controllers/ # Express route handlers
│ ├── llm/ # Gemini API integration and prompts
│ ├── middlewares/ # Authentication, error handlers
│ ├── models/ # Mongoose database schemas
│ ├── routes/ # API route definitions
│ ├── scheduler/ # Scheduled task and reminder management
│ ├── utils/ # Utility functions (date parsing, OAuth setup, etc.)
│ └── server.js # Entry point for the backend server
│
├── frontend/
│ ├── public/ # Static files (index.html, icons, manifest)
│ ├── src/ # React components and pages
│ └── vite.config.js # Frontend bundler configuration
│
├── .gitignore # Git ignore configuration
└── README.md # Project documentation (this file)
```

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
#Edit .env with your values:
 MONGO_URI=...
 JWT_SECRET=...
 GEMINI_API_KEY=...
 GOOGLE_CLIENT_ID=...
 GOOGLE_CLIENT_SECRET=...
 GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env:
# VITE_API_BASE_URL=http://localhost:4000
npm run dev
```
## Usage

```bash
Create a Google Meet with team Friday 5 PM and email boss
```
##  Environment Variables

## backend/.env  
```bash
PORT=4000
MONGO_URI=<mongo‑uri>
JWT_SECRET=<secret>
GEMINI_API_KEY=<key>
EMAIL=<smtp_email>      # dev fallback
EMAIL_PASS=<smtp_pass>
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/callback
```


## frontend/.env
```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Backend
```bash
## Available Scripts
npm run dev — start with nodemon

npm start — production
```
## Frontend
```bash
npm run dev — Vite dev server

npm run build — production build

npm run preview — preview build
```
## Contributing
```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

## MIT License

```bash
Copyright (c) 2025 Jeet Goyal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
```
