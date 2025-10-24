from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid


class InteractionMode(str, Enum):
    SOCRATIC = "socratic"
    WISDOM = "wisdom"
    STORY = "story"


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class ConversationSessionBase(BaseModel):
    interaction_mode: InteractionMode = InteractionMode.WISDOM


class ConversationSessionCreate(ConversationSessionBase):
    user_id: uuid.UUID


class ConversationSessionResponse(ConversationSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    started_at: datetime
    ended_at: Optional[datetime] = None
    summary: Optional[str] = None
    message_count: int = 0

    class Config:
        from_attributes = True


class ConversationMessageBase(BaseModel):
    role: MessageRole
    content: str
    emotion_label: Optional[str] = None
    emotion_confidence: Optional[float] = None
    emotion_emoji: Optional[str] = None
    emotion_color: Optional[str] = None
    verse_id: Optional[str] = None


class ConversationMessageCreate(ConversationMessageBase):
    session_id: uuid.UUID
    sequence_number: int


class ConversationMessageResponse(ConversationMessageBase):
    id: uuid.UUID
    session_id: uuid.UUID
    sequence_number: int
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationContextResponse(BaseModel):
    session_id: uuid.UUID
    messages: List[ConversationMessageResponse]
    total_messages: int