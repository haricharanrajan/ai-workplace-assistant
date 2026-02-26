from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.auth import router as auth_router
from app.chat import router as chat_router
from app.documents import router as docs_router

app = FastAPI(title="AI Workplace Assistant")

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        # add your deployed frontend URL later, e.g.
        # "https://ai-workplace-assistant-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(docs_router)

@app.get("/")
def health():
    return {"status": "Backend running"}