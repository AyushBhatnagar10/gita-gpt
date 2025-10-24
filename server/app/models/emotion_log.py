from sqlalchemy import Column, String, DateTime, Text, Float, Date, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSON, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class EmotionLog(Base):
    __tablename__ = "emotion_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    log_date = Column(Date, nullable=False)
    user_input = Column(Text, nullable=False)
    dominant_emotion = Column(String(50), nullable=False)
    emotion_confidence = Column(Float, nullable=False)
    emotion_emoji = Column(String(10), nullable=False)
    emotion_color = Column(String(20), nullable=False)
    all_emotions = Column(JSON)  # Array of all detected emotions
    verse_ids = Column(ARRAY(String))  # Array of verse IDs shown
    session_id = Column(UUID(as_uuid=True), ForeignKey("conversation_sessions.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Add check constraint for emotion confidence
    __table_args__ = (
        CheckConstraint(
            "emotion_confidence >= 0.0 AND emotion_confidence <= 1.0",
            name="valid_emotion_confidence"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="emotion_logs")
    session = relationship("ConversationSession", back_populates="emotion_logs")

    def __repr__(self):
        return f"<EmotionLog(id={self.id}, user_id={self.user_id}, emotion={self.dominant_emotion}, date={self.log_date})>"