from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid


class EmotionLogBase(BaseModel):
    log_date: date
    user_input: str
    dominant_emotion: str
    emotion_confidence: float
    emotion_emoji: str
    emotion_color: str
    all_emotions: Optional[List[Dict[str, Any]]] = None
    verse_ids: Optional[List[str]] = None


class EmotionLogCreate(EmotionLogBase):
    user_id: uuid.UUID
    session_id: Optional[uuid.UUID] = None


class EmotionLogResponse(EmotionLogBase):
    id: uuid.UUID
    user_id: uuid.UUID
    session_id: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MoodCalendarEntry(BaseModel):
    date: date
    emotion: str
    emoji: str
    color: str
    confidence: float
    verse_ids: List[str]
    summary: str
    all_emotions: Optional[List[Dict[str, Any]]] = None


class MoodCalendarResponse(BaseModel):
    entries: List[MoodCalendarEntry]
    start_date: date
    end_date: date