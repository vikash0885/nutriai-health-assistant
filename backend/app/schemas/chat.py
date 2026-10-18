from pydantic import BaseModel, Field
from typing import Optional, List


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|model|system)$")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: Optional[List[ChatMessage]] = []
    include_today_context: bool = True


class ChatResponse(BaseModel):
    response: str
    detected_language: str = "en"
    referenced_data: Optional[dict] = None
    medical_disclaimer: str = (
        "SehatSense AI provides educational lifestyle & nutrition insights only and does not diagnose, "
        "treat, or cure medical conditions. Always seek professional healthcare advice for medical symptoms."
    )
