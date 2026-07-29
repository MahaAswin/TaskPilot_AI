# 🚀 TaskPilot AI - Enterprise Multi-Agent AI Productivity Platform

> **TaskPilot AI** is an enterprise-grade Multi-Agent AI Productivity Platform that unifies communication, career development, document generation, learning, skill analysis, and creative assistance within a single intelligent workspace. Each AI agent is specialized for a specific domain, enabling users to automate complex tasks without switching between multiple applications. The platform leverages a unified AI provider layer to deliver reliable and intelligent experiences across all modules.
---

## 📌 Problem Statement

Professionals and students frequently switch between multiple disconnected applications to manage emails, career development, document creation, learning, productivity, and creative work. This fragmented workflow increases manual effort, reduces efficiency, and interrupts productivity. Existing AI tools typically solve individual problems but do not provide an integrated experience. TaskPilot AI addresses this challenge by bringing specialized AI agents together in a unified workspace, enabling seamless productivity through intelligent automation.

---
## 🌟 Architecture & Key Modules

- **Project Foundation & Authentication**: Secure JWT authentication, user profile management, protected routes, and session context.
- **Modern Premium SaaS UI**: Modern glassmorphism interface built with Vanilla CSS design system, Framer Motion animations, and Lucide icons.
- **AI Workspace**: Multi-turn conversation playground with attachments, markdown syntax highlighting, and telemetry.
- **Email Intelligence Suite**:
  - **AI Email Agent (Gmail API)**: Connect Gmail securely via Google OAuth 2.0 to compose, refine, edit, and send emails directly using the official Gmail API.
  - **AI Email Briefing**: Paste or upload emails (.txt, .pdf, .docx, .eml) to extract executive summaries, action items, and deadline trackers in <30s.
  - **AI Email Writing Coach**: Inspects email drafts using LanguageTool API + AI to score writing quality, flag mistakes, and provide tone suggestions.
- **Career & Document Automation Suite**:
  - **AI Job Application Agent**: Automates job searching, compatibility scoring, tailored HR email drafting, cover letter PDF creation, and seamless transfer to the AI Email Agent for manual review and sending.
  - **AI Document Generator**: Transforms raw text and uploaded files into downloadable, formatted PDF & Word (.docx) documents with AI formatting options.
  - **AI Career Intelligence**: Parses resumes, matches candidate skills against live job listings from the Adzuna API, identifies skill gaps, and generates career roadmaps.
- **Study, Knowledge & Creative Suite**:
  - **Learning Hub**: AI-generated flashcard decks, interactive MCQ quizzes, and revision checklists.
  - **Skill Analyzer**: Multi-domain competency tracking, skill gap analysis, and radar visualization.
  - **Creative Hub**: AI-generated mind maps, cheatsheets, and creative revision assets.
- **Unified Provider Abstraction Layer**: Multi-provider failover engine supporting **Gemini**, **Grok**, **OpenAI**, **Claude**, **DeepSeek**, **Mistral**, **Ollama (Local Models)**, and **MockProvider** with automatic failover chains.

---

## 🏗️ System Architecture Flow

```
User Input 
   ↓
Coordinator Agent / Sub-Agent Trigger
   ↓
Intent Resolver ➔ Processing Engine ➔ Execution Pipeline
   ↓
Provider Manager (Gemini ➔ Grok ➔ OpenAI ➔ Claude ➔ DeepSeek ➔ Mistral ➔ Ollama ➔ Mock)
   ↓
Context & Asset Generator ➔ Response / Document / Email Payload
   ↓
Unified AI Interface / User Action Review
```

---

## 📂 Architectural Directory Structure

```text
TaskPilot_AI/
├── backend/
│   ├── agents/
│   │   ├── coordinator/        # Central Dispatcher & Multi-Agent Coordinator
│   │   ├── email/              # Gmail API & Email Dispatch Sub-Agent
│   │   └── learning/           # Interactive Assessment Sub-Agent
│   ├── config/                 # Adzuna, OAuth, Database & Provider Configs
│   ├── controllers/            # API Route Request Handlers & Controllers
│   │   ├── authController.js
│   │   ├── careerController.js
│   │   ├── documentController.js
│   │   ├── emailController.js
│   │   ├── emailBriefingController.js
│   │   ├── emailCoachController.js
│   │   ├── jobApplicationController.js
│   │   └── skillController.js
│   ├── middleware/             # Auth JWT, Access Logging & Error Middlewares
│   ├── models/                 # MongoDB Mongoose Data Schemas
│   ├── providers/              # Unified LLM Multi-Provider Abstraction (Gemini, Grok, Ollama, Mock)
│   ├── routes/                 # REST API Express Endpoint Definitions
│   └── services/               # Core Business Logic & External Integrations
│       ├── career/             # Adzuna Job Client & Resume Parser
│       ├── document/           # PDF & Word Document Generators
│       ├── grammar/            # LanguageTool API & Writing Quality Assessor
│       ├── jobApplication/     # HR Mailer & Application Coordinator
│       ├── emailBriefingService.js
│       ├── emailCoachService.js
│       └── aiService.js        # Internal LLM Execution Bridge
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout Components
│   │   │   ├── cards/
│   │   │   ├── common/         # Navbar, Sidebar, PageContainer, Layouts
│   │   │   └── loaders/
│   │   ├── context/            # AuthContext, ThemeProvider, ToastProvider
│   │   ├── pages/              # Application View Pages
│   │   │   ├── auth/           # Login, Register, Password Recovery
│   │   │   ├── career/         # AI Career Intelligence Page
│   │   │   ├── dashboard/      # Main Command Center Dashboard
│   │   │   ├── document/       # AI Document Generator Page
│   │   │   ├── email/          # Email Agent, Briefing & Coach Pages
│   │   │   ├── jobApplication/ # AI Job Application Agent Page
│   │   │   ├── learning/       # Learning Hub Page
│   │   │   ├── skills/         # Skill Analyzer Page
│   │   │   └── workspace/      # Multi-Turn AI Workspace Page
│   │   ├── routes/             # React Router Endpoint Configuration
│   │   └── services/           # Frontend Axios API Client Services
│   ├── index.css               # Global Tailwind CSS Styles & Custom Design Tokens
│   └── vercel.json             # Vercel Single-Page App Deployment Config
│
├── docker-compose.yml          # Multi-Container Full-Stack Production Orchestration
├── render.yaml                 # Render Cloud Deployment Blueprint
└── README.md                   # System Documentation
```

---

## ✨ Key Features

- Multi-Agent AI Productivity Platform
- AI Email Generation & Gmail Integration
- AI Email Briefing & Summarization
- AI Email Writing Coach
- AI Career Intelligence
- AI Job Application Automation
- AI Document Generator (PDF & DOCX)
- Skill Analysis & Learning Recommendations
- AI Learning Hub
- AI Creative Content Generation
- Multi-Provider AI Support
- JWT Authentication
- Modern Responsive SaaS Interface

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (Local or MongoDB Atlas)

### 1. Repository Setup
```bash
git clone https://github.com/MahaAswin/TaskPilot_AI.git
cd TaskPilot_AI
```

### 2. Environment Configuration
Copy the environment variable templates:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

### 3. Install & Start Backend
```bash
cd backend
npm install
npm run dev
# Backend server runs on http://localhost:5000
```

### 4. Install & Start Frontend
```bash
cd ../frontend
npm install
npm run dev
# Frontend web app runs on http://localhost:5173
```

---

## 🐳 Docker Deployment

To launch the full stack (MongoDB, Backend, Nginx Frontend) in a multi-container environment:

```bash
docker-compose up --build -d
```
- **Frontend App**: `http://localhost:80`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

---

## ☁️ Cloud Deployment Setup

### Frontend Deployment (Vercel)
The repository includes a pre-configured `frontend/vercel.json` file. Connect your GitHub repository to Vercel and specify:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend Deployment (Render)
The repository includes a pre-configured `render.yaml` Blueprint file for Render. Define environment variables in Render Dashboard:
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret JWT signing key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials for Gmail API integration

---

## 🧪 Testing Suite

Run backend and frontend smoke test suites:

```bash
# Test backend core engines
cd backend
npm test

# Test frontend components
cd ../frontend
npm test
```

---

## 📄 License & Contributing

TaskPilot AI is open-source under the MIT License. Contributions are welcome!
