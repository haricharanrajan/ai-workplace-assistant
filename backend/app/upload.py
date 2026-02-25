from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(prefix="/upload", tags=["Document Upload"])

# Temporary in-memory storage
document_text = None
ADMIN_PASSWORD = "admin123"

@router.post("/")
async def upload_document(password: str, file: UploadFile = File(...)):
    global document_text

    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Unauthorized")

    content = await file.read()
    document_text = content.decode("utf-8")

    return {"message": "Document uploaded successfully"}