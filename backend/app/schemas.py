from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class DocumentResponse(BaseModel):
    id: int
    filename: str

    class Config:
        orm_mode = True


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str