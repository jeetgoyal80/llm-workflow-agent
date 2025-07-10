# NL Task Automator - System Design Document

## 1. Overview
NL Task Automator is a smart assistant that processes Hindi-English mixed language commands to manage personal tasks like reminders, emails, and Google Calendar events.

## 2. Features
- Natural Language Command Processing
- Task Categorization (reminder, email, meeting)
- Real-time intent extraction
- Google Calendar + Meet Integration
- Email Automation
- WebSocket Notifications

## 3. System Architecture

### A. Frontend (React)
- Task Input UI
- Real-time feedback
- Dark/Light toggle

### B. Backend (Node.js + Express)
- API for NLP processing
- Google API integration
- Reminder scheduler
- Email sender

### C. NLP Pipeline
- Tokenization
- Language detection
- Rule-based + LLM intent classification
- Dispatcher to modules

### D. Database (MongoDB)
Collections:
- Users
- Tasks
- Reminders
- Email Logs

### E. Third-Party Integrations
- Google Calendar API (OAuth 2.0)
- Nodemailer
- Socket.IO (for live updates)

## 4. Data Flow

1. User enters a task
2. Frontend sends to `/api/task`
3. NLP pipeline extracts intent
4. Appropriate module executes
5. Response sent back to frontend

## 5. Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 6. Future Enhancements
- Telegram/WhatsApp bot
- Voice input
- LLM fine-tuning for better intent classification
