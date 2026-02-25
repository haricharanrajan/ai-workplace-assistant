import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI, RateLimitError, APIError
from app import models

from app.database import SessionLocal
from app.deps import get_db
from app.deps import get_current_user
from app.rag import retrieve_relevant_chunks
from sqlalchemy.orm import Session

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")

router = APIRouter(prefix="/chat", tags=["AI Chat"])


class ChatRequest(BaseModel):
    question: str


@router.post("/")
def ask_question(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chunks = retrieve_relevant_chunks(req.question, top_k=3)

    if not chunks:
        return {
            "answer": "No document has been indexed yet. Please ask an admin to upload a document.",
            "context_used": [],
        }

    context = "\n\n".join(chunks)

    prompt = (
    	"You are an internal workplace assistant.\n"
    	"Answer ONLY using the provided context.\n"
    	"If the answer is not explicitly in the context, say:\n"
    	"'I don't have enough information from the uploaded documents.'\n\n"
    	f"Context:\n{context}\n\n"
    	f"Question:\n{req.question}"
    )

    try:
        resp = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": "You are an internal workplace assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
    except RateLimitError:
        raise HTTPException(status_code=429, detail="OpenAI rate limit hit. Retry shortly.")
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI upstream error: {str(e)}")

    answer = resp.choices[0].message.content or ""

    # STORE CHAT HISTORY
    chat_entry = models.ChatHistory(
    	user_id=current_user.id,
    	question=req.question,
    	answer=answer
    )

    db.add(chat_entry)
    db.commit()

    return {
        "answer": answer,
        "context_used": chunks,
    }

@router.get("/history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chats = (
        db.query(models.ChatHistory)
        .filter(models.ChatHistory.user_id == current_user.id)
        .order_by(models.ChatHistory.id.desc())
        .all()
    )

    return [
        {
            "question": c.question,
            "answer": c.answer
        }
        for c in chats
    ]