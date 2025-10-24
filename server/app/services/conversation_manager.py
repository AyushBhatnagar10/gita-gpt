from typing import List, Dict, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.conversation import ConversationSession, ConversationMessage
from app.models.user import User
from app.schemas.conversation import (
    ConversationSessionCreate,
    ConversationSessionResponse,
    ConversationMessageCreate,
    ConversationMessageResponse,
    ConversationContextResponse,
    InteractionMode,
    MessageRole
)
import uuid
import logging

logger = logging.getLogger(__name__)


class ConversationManager:
    """
    Manages conversation sessions and messages for multi-turn dialogue.
    Handles session creation, message storage, context retrieval, and session ending.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.memory_window = 5  # Keep last 5 exchanges (10 messages total)
    
    async def create_session(
        self, 
        user_id: uuid.UUID, 
        interaction_mode: InteractionMode = InteractionMode.WISDOM
    ) -> ConversationSessionResponse:
        """
        Create a new conversation session for a user.
        
        Args:
            user_id: UUID of the user
            interaction_mode: The interaction mode (socratic, wisdom, story)
            
        Returns:
            ConversationSessionResponse with session details
            
        Raises:
            ValueError: If user doesn't exist
        """
        try:
            # Verify user exists
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError(f"User with id {user_id} not found")
            
            # Create new session
            session = ConversationSession(
                user_id=user_id,
                interaction_mode=interaction_mode.value,
                started_at=datetime.utcnow(),
                message_count=0
            )
            
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
            
            logger.info(f"Created conversation session {session.id} for user {user_id}")
            
            return ConversationSessionResponse.from_orm(session)
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating conversation session: {e}")
            raise
    
    async def add_message(
        self,
        session_id: uuid.UUID,
        role: MessageRole,
        content: str,
        emotion_data: Optional[Dict] = None,
        verse_id: Optional[str] = None
    ) -> ConversationMessageResponse:
        """
        Add a message to a conversation session.
        
        Args:
            session_id: UUID of the conversation session
            role: Role of the message sender (user or assistant)
            content: Message content
            emotion_data: Optional emotion detection data
            verse_id: Optional verse ID if verse was referenced
            
        Returns:
            ConversationMessageResponse with message details
            
        Raises:
            ValueError: If session doesn't exist
        """
        try:
            # Verify session exists
            session = self.db.query(ConversationSession).filter(
                ConversationSession.id == session_id
            ).first()
            if not session:
                raise ValueError(f"Session with id {session_id} not found")
            
            # Get next sequence number
            last_message = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session_id
            ).order_by(desc(ConversationMessage.sequence_number)).first()
            
            sequence_number = (last_message.sequence_number + 1) if last_message else 1
            
            # Extract emotion data if provided
            emotion_label = None
            emotion_confidence = None
            emotion_emoji = None
            emotion_color = None
            
            if emotion_data:
                emotion_label = emotion_data.get('label')
                emotion_confidence = emotion_data.get('confidence')
                emotion_emoji = emotion_data.get('emoji')
                emotion_color = emotion_data.get('color')
            
            # Create message
            message = ConversationMessage(
                session_id=session_id,
                role=role.value,
                content=content,
                emotion_label=emotion_label,
                emotion_confidence=emotion_confidence,
                emotion_emoji=emotion_emoji,
                emotion_color=emotion_color,
                verse_id=verse_id,
                sequence_number=sequence_number,
                created_at=datetime.utcnow()
            )
            
            self.db.add(message)
            
            # Update session message count
            session.message_count += 1
            
            self.db.commit()
            self.db.refresh(message)
            
            logger.info(f"Added message {message.id} to session {session_id}")
            
            return ConversationMessageResponse.from_orm(message)
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error adding message to session: {e}")
            raise
    
    async def get_context(
        self,
        session_id: uuid.UUID,
        window_size: Optional[int] = None
    ) -> ConversationContextResponse:
        """
        Retrieve recent conversation context for a session.
        
        Args:
            session_id: UUID of the conversation session
            window_size: Number of recent messages to retrieve (default: memory_window * 2)
            
        Returns:
            ConversationContextResponse with recent messages
            
        Raises:
            ValueError: If session doesn't exist
        """
        try:
            # Verify session exists
            session = self.db.query(ConversationSession).filter(
                ConversationSession.id == session_id
            ).first()
            if not session:
                raise ValueError(f"Session with id {session_id} not found")
            
            # Use default window size if not provided (memory_window exchanges = memory_window * 2 messages)
            if window_size is None:
                window_size = self.memory_window * 2
            
            # Get recent messages
            messages = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session_id
            ).order_by(desc(ConversationMessage.sequence_number)).limit(window_size).all()
            
            # Reverse to get chronological order
            messages.reverse()
            
            # Get total message count
            total_messages = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session_id
            ).count()
            
            message_responses = [
                ConversationMessageResponse.from_orm(msg) for msg in messages
            ]
            
            logger.info(f"Retrieved {len(messages)} messages for session {session_id}")
            
            return ConversationContextResponse(
                session_id=session_id,
                messages=message_responses,
                total_messages=total_messages
            )
            
        except Exception as e:
            logger.error(f"Error retrieving conversation context: {e}")
            raise
    
    async def end_session(
        self,
        session_id: uuid.UUID,
        summary: Optional[str] = None
    ) -> ConversationSessionResponse:
        """
        End a conversation session and optionally add a summary.
        
        Args:
            session_id: UUID of the conversation session
            summary: Optional summary of the conversation
            
        Returns:
            ConversationSessionResponse with updated session details
            
        Raises:
            ValueError: If session doesn't exist or is already ended
        """
        try:
            # Get session
            session = self.db.query(ConversationSession).filter(
                ConversationSession.id == session_id
            ).first()
            if not session:
                raise ValueError(f"Session with id {session_id} not found")
            
            if session.ended_at:
                raise ValueError(f"Session {session_id} is already ended")
            
            # Update session
            session.ended_at = datetime.utcnow()
            if summary:
                session.summary = summary
            
            self.db.commit()
            self.db.refresh(session)
            
            logger.info(f"Ended conversation session {session_id}")
            
            return ConversationSessionResponse.from_orm(session)
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error ending conversation session: {e}")
            raise
    
    def get_conversation_history_for_llm(
        self,
        session_id: uuid.UUID,
        window_size: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Get conversation history formatted for LLM context.
        
        Args:
            session_id: UUID of the conversation session
            window_size: Number of recent messages to retrieve
            
        Returns:
            List of message dictionaries with role and content
        """
        try:
            if window_size is None:
                window_size = self.memory_window * 2
            
            messages = self.db.query(ConversationMessage).filter(
                ConversationMessage.session_id == session_id
            ).order_by(desc(ConversationMessage.sequence_number)).limit(window_size).all()
            
            # Reverse to get chronological order
            messages.reverse()
            
            # Format for LLM
            history = []
            for msg in messages:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })
            
            return history
            
        except Exception as e:
            logger.error(f"Error getting conversation history for LLM: {e}")
            return []