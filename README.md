# 🚀 TaskPilot AI - Agentic AI Operating System

> **TaskPilot AI** is an enterprise-grade Agentic AI Operating System. Rather than functioning as isolated AI chatbots, TaskPilot AI orchestrates 8 specialized autonomous agents (*Coordinator, Knowledge, Learning, Creative, Planner, Task, Skill Analyzer, Productivity Coach*) through a central routing engine and unified provider abstraction layer.

---

## 🌟 Architecture & Key Modules

- **Project Foundation & Authentication**: Secure JWT authentication, user profile management, protected routes, and session context.
- **Premium Light SaaS UI**: Modern glassmorphism interface built with Vanilla CSS design system, Framer Motion animations, and Lucide icons.
- **AI Workspace**: Multi-turn conversation playground with attachments, markdown syntax highlighting, and response telemetry.
- **AI Planning Canvas**: Visual node-based roadmap creator and milestone breakdown canvas.
- **8 Autonomous Sub-Agents**:
  1. **Coordinator Agent**: Central dispatcher, intent resolver, and response aggregator.
  2. **Planner Agent**: Generates daily milestone matrices and study schedules.
  3. **Knowledge Agent**: Manages RAG document indexing and knowledge base queries.
  4. **Learning Agent**: Builds interactive quizzes, assessments, and difficulty metrics.
  5. **Creative Agent**: Generates flashcard decks, cheatsheets, and creative content.
  6. **Task Agent**: Tracks task queues, priority matrices, XP levels, streaks, and achievements.
  7. **Skill Analyzer Agent**: Multi-domain skill radar visualization and topic progress tracking.
  8. **Productivity Coach Agent**: Focus session Pomodoro timer, distraction tracking, and habit analytics.
- **Multi-Agent Orchestration Engine**: Intent Analyzer, Workflow Planner, Agent Router, Shared Context Manager, and Node Graph Canvas.
- **AI Provider Integration Layer**: Vendor-agnostic abstraction supporting **Gemini**, **Grok**, **OpenAI**, **Claude**, **DeepSeek**, **Mistral**, **Ollama (Local Models)**, and **MockProvider** with automated fallback chains.

---

## 🏗️ System Architecture Flow

```
User Input 
   ↓
Coordinator Agent
   ↓
Intent Analyzer ➔ Workflow Planner ➔ Agent Router ➔ Execution Pipeline
   ↓
Provider Manager (Gemini ➔ Grok ➔ OpenAI ➔ Claude ➔ DeepSeek ➔ Mistral ➔ Ollama ➔ Mock)
   ↓
Shared Context Manager ➔ Response Aggregator
   ↓
Unified AI Response
```

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

To launch the full stack (MongoDB, Backend, Nginx Frontend) in multi-container environment:

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
