🚀 AI Workplace Assistant

AI-Powered Internal Knowledge Assistant using FastAPI + React + OpenAI (RAG architecture).


🌐 Live Deployment

Frontend (Live Application URL)
👉 https://ai-workplace-assistant-frontend.onrender.com

Backend API URL
👉 https://ai-workplace-assistant-backend.onrender.com

Backend Swagger Docs
👉 https://ai-workplace-assistant-backend.onrender.com/docs

GitHub Repository
👉 https://github.com/haricharanrajan/ai-workplace-assistant


📌 Project Overview

The AI Workplace Assistant allows organizations to:

Upload internal company documents (Admin role)

Ask AI-powered questions based strictly on uploaded documents (Employee role)

Retrieve answers using a Retrieval-Augmented Generation (RAG) pipeline

Maintain chat history per user

Enforce role-based access control (RBAC)


🏗️ System Architecture
Frontend (React - Render Static Site)
        ↓
Backend API (FastAPI - Render Web Service)
        ↓
SQLite Database (Users, Documents, Chat History)
        ↓
Vector Embeddings (Stored in DB)
        ↓
OpenAI API (Embeddings + LLM Completion)


👥 User Roles

🔐 Admin

Login

Upload documents (.txt, .pdf, .docx)

Documents are embedded and indexed

👨‍💼 Employee

Login

Ask questions via chat interface

View AI-generated answers

View previous chat history


📝 User Registration

User registration is supported via backend API:

POST /auth/register

For this project, registration is performed through Swagger UI instead of the frontend to:

Prevent unauthorized admin creation

Simulate real enterprise user provisioning

Maintain system security

Demo user creation

Open Swagger → /auth/register

Admin example:

{
  "username": "admin1",
  "password": "Admin@123",
  "role": "admin"
}

Employee example:

{
  "username": "emp1",
  "password": "Emp@123",
  "role": "employee"
}


🧠 AI Implementation (RAG Pipeline)

When a user asks a question:

Question is converted into an embedding (OpenAI)

Similar document chunks are retrieved via embedding similarity

Retrieved context + question are sent to LLM

Model is instructed to answer strictly from context

If answer not found, it responds:

“Information not available in uploaded documents.”

Question and answer are stored in chat history


📂 Project Structure
ai-workplace-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── documents.py
│   │   ├── chat.py
│   │   ├── rag.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── deps.py
│   │   ├── database.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    └── ai-client/
        ├── src/
        │   ├── components/
        │   ├── hooks/
        │   ├── api.js
        │   ├── App.js
        ├── package.json
        └── .env.example


⚙️ Backend Setup (Local)

1️⃣ Create virtual environment
cd backend
python -m venv venv
venv\Scripts\activate
2️⃣ Install dependencies
pip install -r requirements.txt
3️⃣ Configure environment variables

Create .env:

OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
DATABASE_URL=sqlite:///./app.db
CHAT_MODEL=gpt-4o-mini
4️⃣ Run backend
uvicorn app.main:app --reload

Open:
http://127.0.0.1:8000/docs


💻 Frontend Setup (Local)

1️⃣ Install dependencies
cd frontend/ai-client
npm install
2️⃣ Configure environment

Create .env:

REACT_APP_API_BASE_URL=http://127.0.0.1:8000
3️⃣ Run frontend
npm start

Open:
http://localhost:3000


🌐 Deployment
Backend (Render Web Service)

Runtime: Python

Start command:

uvicorn app.main:app --host 0.0.0.0 --port 10000

Environment variables configured in Render dashboard

Frontend (Render Static Site)

Root Directory:

frontend/ai-client

Build Command:

npm install && npm run build

Publish Directory:

build

Environment Variable:

REACT_APP_API_BASE_URL=https://ai-workplace-assistant-backend.onrender.com


🔐 Authentication & Security

JWT-based authentication

Password hashing using bcrypt

Role-based access control (Admin / Employee)

Upload endpoint protected by server-side admin verification

CORS configured for production frontend


🗄️ Database

Current implementation uses:

SQLite (for simplicity and rapid deployment)

Stores:

Users

Documents

Embeddings

Chat history

Note: For production scalability, PostgreSQL is recommended.


🎯 Design Decisions

Used FastAPI for clean REST structure and Swagger documentation

Used React for modular, responsive UI

Used OpenAI embeddings for semantic similarity search

Used RAG to prevent hallucination

Backend-controlled registration for security


⚠️ Challenges Faced

Handling PDF/DOCX extraction properly

Managing CORS between frontend and backend

Ensuring role-based UI rendering

Deployment synchronization between services

Handling SQLite persistence limitations on Render free tier


🚀 Future Improvements

Switch to PostgreSQL for persistence

Add document listing & deletion UI

Add streaming LLM responses

Implement admin-only user creation

Add vector database (e.g., Pinecone, Weaviate)


✅ Project Requirements Coverage
Requirement	        Status
JWT Auth	        ✔ Implemented
Role-Based Access	✔ Implemented
Document Upload 	✔ Admin Only
PDF/DOCX Extraction	✔ Implemented
RAG Pipeline    	✔ Implemented
Chat History    	✔ Stored & Displayed
Fully Deployed   	✔ Render
Live URL        	✔ Provided


📄 License

For academic/project submission purposes.