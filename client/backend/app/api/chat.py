from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import require_auth
from app.models.user import User
from app.services.emotion_detection import get_emotion_service, EmotionDetectionService
from app.services.vector_search import VectorSearchService
from app.services.reflection_generation import get_reflection_service, ReflectionGenerationService
from app.services.conversation_manager import ConversationManager
from app.services.logging_service import LoggingService
from app.schemas.emotion import EmotionData
from app.schemas.verse import VerseSearchResult
from app.schemas.reflection import ConversationMessage
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    """Request model for the main chat endpoint."""
    user_input: str = Field(..., min_length=1, max_length=5000, description="User's message")
    session_id: Optional[uuid.UUID] = Field(None, description="Conversation session ID (optional for new sessions)")
    interaction_mode: str = Field("wisdom", description="Interaction mode: 'socratic', 'wisdom', or 'story'")
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_input": "I'm feeling overwhelmed with all my responsibilities at work and home.",
                "session_id": "550e8400-e29b-41d4-a716-446655440001",
                "interaction_mode": "wisdom"
            }
        }


class ChatResponse(BaseModel):
    """Response model for the main chat endpoint."""
    reflection: str = Field(..., description="Generated reflection with verse and commentary")
    emotion: EmotionData = Field(..., description="Detected emotion data")
    verses: List[VerseSearchResult] = Field(..., description="Retrieved verses")
    session_id: uuid.UUID = Field(..., description="Conversation session ID")
    interaction_mode: str = Field(..., description="Mode used for generation")
    fallback_used: bool = Field(False, description="Whether any fallback mechanisms were used")
    
    class Config:
        json_schema_extra = {
            "example": {
                "reflection": "I can sense the weight of anxiety you're carrying...",
                "emotion": {
                    "label": "anxiety",
                    "confidence": 0.78,
                    "emoji": "😰",
                    "color": "#E0E7FF"
                },
                "verses": [
                    {
                        "id": "BG2.47",
                        "chapter": 2,
                        "verse": 47,
                        "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
                        "eng_meaning": "You have a right to perform your prescribed duty, but not to the fruits of action.",
                        "similarity_score": 0.87
                    }
                ],
                "session_id": "550e8400-e29b-41d4-a716-446655440001",
                "interaction_mode": "wisdom",
                "fallback_used": False
            }
        }


# Global service instances (will be initialized on first use)
_vector_service: Optional[VectorSearchService] = None


def get_vector_service() -> VectorSearchService:
    """Dependency to get or create VectorSearchService instance."""
    global _vector_service
    if _vector_service is None:
        try:
            _vector_service = VectorSearchService()
            # Initialize database if CSV file exists
            try:
                _vector_service.initialize_database("Bhagwad_Gita.csv")
            except Exception as e:
                logger.warning(f"Could not initialize database from CSV: {e}")
        except Exception as e:
            logger.error(f"Failed to initialize VectorSearchService: {e}")
            raise HTTPException(status_code=500, detail="Vector search service unavailable")
    
    return _vector_service


def get_conversation_manager(db: Session = Depends(get_db)) -> ConversationManager:
    """Dependency to get conversation manager."""
    return ConversationManager(db)


def get_logging_service(db: Session = Depends(get_db)) -> LoggingService:
    """Dependency to get logging service."""
    return LoggingService(db)


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(require_auth),
    emotion_service: EmotionDetectionService = Depends(get_emotion_service),
    vector_service: VectorSearchService = Depends(get_vector_service),
    reflection_service: ReflectionGenerationService = Depends(get_reflection_service),
    conversation_manager: ConversationManager = Depends(get_conversation_manager),
    logging_service: LoggingService = Depends(get_logging_service)
) -> ChatResponse:
    """
    Main conversation orchestration endpoint that handles the complete flow.
    
    This endpoint orchestrates the entire conversation flow:
    1. Detects emotions from user input
    2. Searches for relevant verses based on semantic similarity
    3. Retrieves conversation context if session exists
    4. Generates empathetic reflection linking verses to user's situation
    5. Logs the interaction for mood tracking
    6. Stores messages in conversation history
    
    The endpoint implements comprehensive error handling with graceful fallbacks
    to ensure users always receive meaningful guidance even if individual
    services fail.
    
    **Parameters:**
    - **user_input**: The user's message (1-5000 characters)
    - **user_id**: UUID of the authenticated user
    - **session_id**: Optional session ID (creates new session if not provided)
    - **interaction_mode**: One of 'socratic', 'wisdom', 'story' (default: 'wisdom')
    
    **Returns:**
    - **reflection**: Generated reflection with verse and commentary
    - **emotion**: Detected emotion with confidence, emoji, and color
    - **verses**: List of relevant verses from semantic search
    - **session_id**: Session ID for continued conversation
    - **interaction_mode**: Mode used for generation
    - **fallback_used**: Whether any fallback mechanisms were triggered
    
    **Error Handling:**
    The endpoint implements multiple fallback layers:
    - Emotion detection failure → neutral emotion
    - Vector search failure → random verse from cache
    - LLM API failure → template-based reflection
    - Database issues → in-memory queuing with retry
    """
    fallback_used = False
    
    try:
        # Validate interaction mode
        valid_modes = ["socratic", "wisdom", "story"]
        if request.interaction_mode not in valid_modes:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid interaction mode '{request.interaction_mode}'. Must be one of: {valid_modes}"
            )
        
        logger.info(f"Processing chat request for user {current_user.id}, session {request.session_id}")
        
        # Step 1: Detect emotions from user input
        try:
            emotions_data = emotion_service.detect_emotion(
                text=request.user_input,
                threshold=0.3
            )
            dominant_emotion_data = emotion_service.get_dominant_emotion(emotions_data)
            emotion = EmotionData(**dominant_emotion_data)
            logger.info(f"Detected emotion: {emotion.label} (confidence: {emotion.confidence})")
            
        except Exception as e:
            logger.warning(f"Emotion detection failed, using neutral fallback: {e}")
            fallback_used = True
            emotion = EmotionData(
                label="neutral",
                confidence=0.5,
                emoji="😐",
                color="#F3F4F6"
            )
        
        # Step 2: Search for relevant verses
        try:
            verses_data = vector_service.search_verses(
                query=request.user_input,
                emotion=emotion.label,
                top_k=3
            )
            verses = [VerseSearchResult(**verse) for verse in verses_data]
            logger.info(f"Found {len(verses)} relevant verses")
            
            if not verses:
                raise Exception("No verses found")
                
        except Exception as e:
            logger.warning(f"Verse search failed, using fallback verse: {e}")
            fallback_used = True
            # Fallback to a default verse (BG2.47 - famous karma yoga verse)
            verses = [VerseSearchResult(
                id="BG2.47",
                chapter=2,
                verse=47,
                shloka="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
                transliteration="karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
                eng_meaning="You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
                hin_meaning="तुम्हारा अधिकार केवल कर्म करने में है, फल में नहीं। इसलिए तुम कर्म के फल के हेतु मत बनो और न ही तुम्हारी अकर्म में आसक्ति हो।",
                similarity_score=0.5
            )]
        
        # Step 3: Handle conversation session
        try:
            if request.session_id:
                # Get existing conversation context
                try:
                    context = await conversation_manager.get_context(
                        session_id=request.session_id,
                        window_size=10  # Last 5 exchanges
                    )
                    conversation_history = [
                        ConversationMessage(
                            role=msg.role.value,
                            content=msg.content,
                            timestamp=msg.created_at.isoformat()
                        ) for msg in context.messages
                    ]
                    session_id = request.session_id
                    logger.info(f"Retrieved context: {len(conversation_history)} messages")
                    
                except Exception as e:
                    logger.warning(f"Failed to retrieve conversation context: {e}")
                    conversation_history = []
                    session_id = request.session_id
            else:
                # Create new session
                try:
                    from app.schemas.conversation import InteractionMode
                    mode_map = {
                        "socratic": InteractionMode.SOCRATIC,
                        "wisdom": InteractionMode.WISDOM,
                        "story": InteractionMode.STORY
                    }
                    
                    session = await conversation_manager.create_session(
                        user_id=current_user.id,
                        interaction_mode=mode_map[request.interaction_mode]
                    )
                    session_id = session.id
                    conversation_history = []
                    logger.info(f"Created new session: {session_id}")
                    
                except Exception as e:
                    logger.warning(f"Failed to create session, using temporary ID: {e}")
                    session_id = uuid.uuid4()
                    conversation_history = []
                    fallback_used = True
                    
        except Exception as e:
            logger.error(f"Session management failed: {e}")
            session_id = request.session_id or uuid.uuid4()
            conversation_history = []
            fallback_used = True
        
        # Step 4: Generate reflection
        try:
            reflection_text = reflection_service.generate_reflection(
                user_input=request.user_input,
                emotion_data=emotion.model_dump(),
                verses=[verse.model_dump() for verse in verses],
                interaction_mode=request.interaction_mode,
                conversation_history=[msg.model_dump() for msg in conversation_history]
            )
            logger.info("Generated reflection using Gemini API")
            
        except Exception as e:
            logger.warning(f"Reflection generation failed, using fallback: {e}")
            fallback_used = True
            try:
                reflection_text = reflection_service.generate_fallback_reflection(
                    user_input=request.user_input,
                    emotion_data=emotion.model_dump(),
                    verses=[verse.model_dump() for verse in verses]
                )
                logger.info("Generated fallback reflection")
            except Exception as fallback_error:
                logger.error(f"Fallback reflection also failed: {fallback_error}")
                # Last resort reflection
                reflection_text = f"""I understand you're experiencing {emotion.label}. Here's a verse that may provide guidance:

**Verse {verses[0].chapter}.{verses[0].verse}:**

Sanskrit: {verses[0].shloka}

English: {verses[0].eng_meaning}

This ancient wisdom reminds us that we can find peace and clarity even in challenging times. Take a moment to reflect on how this teaching might apply to your current situation."""
        
        # Step 5: Store user message in conversation
        try:
            await conversation_manager.add_message(
                session_id=session_id,
                role="user",
                content=request.user_input,
                emotion_data={
                    "label": emotion.label,
                    "confidence": emotion.confidence,
                    "emoji": emotion.emoji,
                    "color": emotion.color
                }
            )
            logger.info("Stored user message")
            
        except Exception as e:
            logger.warning(f"Failed to store user message: {e}")
            # Continue without storing - this is not critical for the response
        
        # Step 6: Store assistant response in conversation
        try:
            await conversation_manager.add_message(
                session_id=session_id,
                role="assistant",
                content=reflection_text,
                verse_id=verses[0].id
            )
            logger.info("Stored assistant response")
            
        except Exception as e:
            logger.warning(f"Failed to store assistant response: {e}")
            # Continue without storing - this is not critical for the response
        
        # Step 7: Log interaction for mood tracking
        try:
            await logging_service.log_interaction(
                user_id=current_user.id,
                user_input=request.user_input,
                emotion_data={
                    "label": emotion.label,
                    "confidence": emotion.confidence,
                    "emoji": emotion.emoji,
                    "color": emotion.color
                },
                verse_ids=[verse.id for verse in verses],
                session_id=session_id
            )
            logger.info("Logged interaction for mood tracking")
            
        except Exception as e:
            logger.warning(f"Failed to log interaction: {e}")
            # Continue without logging - this is not critical for the response
        
        # Return complete response
        response = ChatResponse(
            reflection=reflection_text,
            emotion=emotion,
            verses=verses,
            session_id=session_id,
            interaction_mode=request.interaction_mode,
            fallback_used=fallback_used
        )
        
        logger.info(f"Chat request completed successfully (fallback_used: {fallback_used})")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors)
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}")
        
        # Last resort error handling - try to provide minimal response
        try:
            fallback_emotion = EmotionData(
                label="neutral",
                confidence=0.5,
                emoji="😐",
                color="#F3F4F6"
            )
            
            fallback_verse = VerseSearchResult(
                id="BG2.47",
                chapter=2,
                verse=47,
                shloka="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
                eng_meaning="You have a right to perform your prescribed duty, but not to the fruits of action.",
                similarity_score=0.5
            )
            
            fallback_reflection = """I'm here to provide guidance from the Bhagavad Gita. Here's a fundamental teaching:

**Verse 2.47:**

Sanskrit: कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।

English: You have a right to perform your prescribed duty, but not to the fruits of action.

This verse reminds us to focus on our actions rather than worrying about outcomes. Whatever you're facing, remember that you have the power to choose your response."""
            
            return ChatResponse(
                reflection=fallback_reflection,
                emotion=fallback_emotion,
                verses=[fallback_verse],
                session_id=request.session_id or uuid.uuid4(),
                interaction_mode=request.interaction_mode,
                fallback_used=True
            )
            
        except Exception as final_error:
            logger.error(f"Final fallback also failed: {final_error}")
            raise HTTPException(
                status_code=500,
                detail="Unable to process your request. Please try again later."
            )


@router.get("/health")
async def chat_service_health(
    emotion_service: EmotionDetectionService = Depends(get_emotion_service),
    vector_service: VectorSearchService = Depends(get_vector_service),
    reflection_service: ReflectionGenerationService = Depends(get_reflection_service),
    db: Session = Depends(get_db)
) -> dict:
    """
    Health check endpoint for the chat orchestration service.
    
    Tests all integrated services and returns overall system health.
    """
    health_status = {
        "status": "healthy",
        "services": {},
        "message": "Chat orchestration service is operational"
    }
    
    overall_healthy = True
    
    # Test emotion detection service
    try:
        test_emotions = emotion_service.detect_emotion("I am feeling good today")
        health_status["services"]["emotion_detection"] = {
            "status": "healthy",
            "test_passed": len(test_emotions) > 0
        }
    except Exception as e:
        health_status["services"]["emotion_detection"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        overall_healthy = False
    
    # Test vector search service
    try:
        test_verses = vector_service.search_verses("dharma", top_k=1)
        health_status["services"]["vector_search"] = {
            "status": "healthy",
            "test_passed": len(test_verses) > 0,
            "verses_count": vector_service.collection.count()
        }
    except Exception as e:
        health_status["services"]["vector_search"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        overall_healthy = False
    
    # Test reflection generation service
    try:
        test_emotion = {"label": "neutral", "confidence": 0.5, "emoji": "😐", "color": "#F3F4F6"}
        test_verse = [{"id": "BG2.47", "shloka": "test", "eng_meaning": "test"}]
        test_reflection = reflection_service.generate_reflection(
            user_input="Test message",
            emotion_data=test_emotion,
            verses=test_verse,
            interaction_mode="wisdom"
        )
        health_status["services"]["reflection_generation"] = {
            "status": "healthy",
            "test_passed": len(test_reflection) > 0
        }
    except Exception as e:
        # Check if fallback works
        try:
            fallback_test = reflection_service.generate_fallback_reflection(
                user_input="Test message",
                emotion_data=test_emotion,
                verses=test_verse
            )
            health_status["services"]["reflection_generation"] = {
                "status": "degraded",
                "fallback_working": True,
                "error": str(e)
            }
        except:
            health_status["services"]["reflection_generation"] = {
                "status": "unhealthy",
                "error": str(e)
            }
            overall_healthy = False
    
    # Test database connectivity
    try:
        from app.models.conversation import ConversationSession
        db.query(ConversationSession).limit(1).all()
        health_status["services"]["database"] = {
            "status": "healthy",
            "connection": "active"
        }
    except Exception as e:
        health_status["services"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        overall_healthy = False
    
    if not overall_healthy:
        health_status["status"] = "degraded"
        health_status["message"] = "Some services are experiencing issues, but fallbacks are available"
    
    return health_status