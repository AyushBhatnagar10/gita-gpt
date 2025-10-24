from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey, Float, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class ConversationSession(Base):
    __tablename__ = "conversation_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    interaction_mode = Column(String(20), default="wisdom")
    summary = Column(Text)
    message_count = Column(Integer, default=0)

    # Add check constraint for interaction_mode
    __table_args__ = (
        CheckConstraint(
            interaction_mode.in_(["socratic", "wisdom", "story"]),
            name="valid_interaction_mode"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="conversation_sessions")
    messages = relationship("ConversationMessage", back_populates="session", cascade="all, delete-orphan")
    emotion_logs = relationship("EmotionLog", back_populates="session")

    def __repr__(self):
        return f"<ConversationSession(id={self.id}, user_id={self.user_id}, mode={self.interaction_mode})>"


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("conversation_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    emotion_label = Column(String(50))
    emotion_confidence = Column(Float)
    emotion_emoji = Column(String(10))
    emotion_color = Column(String(20))
    verse_id = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sequence_number = Column(Integer, nullable=False)

    # Add check constraints
    __table_args__ = (
        CheckConstraint(
            role.in_(["user", "assistant"]),
            name="valid_role"
        ),
        CheckConstraint(
            "emotion_confidence IS NULL OR (emotion_confidence >= 0.0 AND emotion_confidence <= 1.0)",
            name="valid_emotion_confidence"
        ),
    )

    # Relationships
    session = relationship("ConversationSession", back_populates="messages")

    def __repr__(self):
        return f"<ConversationMessage(id={self.id}, session_id={self.session_id}, role={self.role})>"