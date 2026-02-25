from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os

from app.deps import get_db, require_admin
from app import models
from app.rag import embed_document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_FOLDER = "uploaded_docs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    
    # File type validation
    allowed = [".txt", ".pdf", ".docx"]

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed: txt, pdf, docx"
        )

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read text for embedding
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Generate embeddings
    embed_document(text)

    new_doc = models.Document(
        filename=file.filename,
        filepath=file_path
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {"message": "Document uploaded and indexed successfully"}