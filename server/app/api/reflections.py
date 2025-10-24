from fastapi import APIRouter, HTTPException, Depends
from app.schemas.reflection import ReflectionRequest, ReflectionResponse, ReflectionError
from app.services.reflection_generation import get_reflection_service, ReflectionGenerationService
from typing import List

router = APIRouter(prefix="/reflections", tags=["reflections"])


@router.post("/generate", response_model=ReflectionResponse)
async def generate_reflection(
    request: ReflectionRequest,
    reflection_service: ReflectionGenerationService = Depends(get_reflection_service)
) -> ReflectionResponse:
    """
    Generate empathetic reflection linking Bhagavad Gita verses to user's situation.
    
    This endpoint takes user input, emotion data, and relevant verses to generate
    a personalized reflection in one of three modes:
    
    - **Socratic**: Reflection-focused with guiding questions for self-discovery
    - **Wisdom**: Direct interpretation with clear actionable insights
    - **Story**: Narrative context from Mahabharata with modern parallels
    
    The service uses Google Gemini API to generate contextually appropriate
    commentary that acknowledges the user's emotional state and connects
    ancient wisdom to their current situation.
    
    **Parameters:**
    - **user_input**: The user's original message (1-5000 characters)
    - **emotion_data**: Detected emotion with confidence, emoji, and color
    - **verses**: List of relevant verses from semantic search (at least 1)
    - **interaction_mode**: One of 'socratic', 'wisdom', 'story' (default: 'wisdom')
    - **conversation_history**: Recent messages for context (optional)
    
    **Returns:**
    - **reflection**: Generated reflection with verse and commentary
    - **verse_id**: ID of the primary verse used
    - **interaction_mode**: Mode used for generation
    - **fallback_used**: Whether template fallback was used due to API issues
    
    **Error Handling:**
    If the Gemini API fails, the service automatically falls back to a
    template-based reflection to ensure users always receive guidance.
    """
    try:
        # Validate interaction mode
        valid_modes = ["socratic", "wisdom", "story"]
        if request.interaction_mode not in valid_modes:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid interaction mode '{request.interaction_mode}'. Must be one of: {valid_modes}"
            )
        
        # Validate verses
        if not request.verses:
            raise HTTPException(
                status_code=400,
                detail="At least one verse is required for reflection generation"
            )
        
        # Convert Pydantic models to dictionaries for service
        emotion_dict = request.emotion_data.model_dump()
        verses_list = [verse.model_dump() for verse in request.verses]
        history_list = []
        if request.conversation_history:
            history_list = [msg.model_dump() for msg in request.conversation_history]
        
        # Generate reflection using Gemini API
        try:
            reflection_text = reflection_service.generate_reflection(
                user_input=request.user_input,
                emotion_data=emotion_dict,
                verses=verses_list,
                interaction_mode=request.interaction_mode,
                conversation_history=history_list
            )
            
            return ReflectionResponse(
                reflection=reflection_text,
                verse_id=request.verses[0].id,
                interaction_mode=request.interaction_mode,
                fallback_used=False
            )
            
        except Exception as gemini_error:
            # Gemini API failed, use fallback template
            print(f"Gemini API error, using fallback: {gemini_error}")
            
            fallback_reflection = reflection_service.generate_fallback_reflection(
                user_input=request.user_input,
                emotion_data=emotion_dict,
                verses=verses_list
            )
            
            return ReflectionResponse(
                reflection=fallback_reflection,
                verse_id=request.verses[0].id,
                interaction_mode=request.interaction_mode,
                fallback_used=True
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors)
        raise
        
    except Exception as e:
        # Handle unexpected errors
        print(f"Unexpected error in reflection generation: {e}")
        
        # Try to provide fallback reflection if possible
        if hasattr(request, 'verses') and request.verses:
            try:
                fallback_reflection = reflection_service.generate_fallback_reflection(
                    user_input=request.user_input,
                    emotion_data=request.emotion_data.model_dump(),
                    verses=[verse.model_dump() for verse in request.verses]
                )
                
                return ReflectionResponse(
                    reflection=fallback_reflection,
                    verse_id=request.verses[0].id,
                    interaction_mode=request.interaction_mode,
                    fallback_used=True
                )
            except:
                pass
        
        # Last resort error response
        raise HTTPException(
            status_code=500,
            detail="Unable to generate reflection. Please try again later."
        )


@router.get("/modes")
async def get_interaction_modes() -> dict:
    """
    Get available interaction modes and their descriptions.
    
    Returns information about the three available modes for reflection generation:
    Socratic, Wisdom, and Story modes.
    """
    return {
        "modes": {
            "socratic": {
                "name": "Socratic",
                "description": "Reflection-focused approach with guiding questions for self-discovery",
                "style": "Questions and gentle guidance to help you find your own insights"
            },
            "wisdom": {
                "name": "Wisdom", 
                "description": "Direct interpretation with clear actionable insights",
                "style": "Clear explanations and practical applications of verse wisdom"
            },
            "story": {
                "name": "Story",
                "description": "Narrative context from Mahabharata with modern parallels", 
                "style": "Engaging stories that connect ancient narratives to your situation"
            }
        },
        "default": "wisdom"
    }


@router.get("/health")
async def reflection_service_health(
    reflection_service: ReflectionGenerationService = Depends(get_reflection_service)
) -> dict:
    """
    Health check endpoint for the reflection generation service.
    
    Tests the Gemini API connection and service functionality.
    """
    try:
        # Test with minimal data
        test_emotion = {
            "label": "neutral",
            "confidence": 0.5,
            "emoji": "😐",
            "color": "#F3F4F6"
        }
        
        test_verse = [{
            "id": "BG2.47",
            "chapter": 2,
            "verse": 47,
            "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
            "eng_meaning": "You have a right to perform your prescribed duty, but not to the fruits of action."
        }]
        
        # Try to generate a test reflection
        test_reflection = reflection_service.generate_reflection(
            user_input="Test message",
            emotion_data=test_emotion,
            verses=test_verse,
            interaction_mode="wisdom"
        )
        
        return {
            "status": "healthy",
            "gemini_api": "operational",
            "test_generation": len(test_reflection) > 0,
            "available_modes": ["socratic", "wisdom", "story"],
            "message": "Reflection generation service is operational"
        }
        
    except Exception as e:
        # Check if fallback works
        try:
            fallback_test = reflection_service.generate_fallback_reflection(
                user_input="Test message",
                emotion_data=test_emotion,
                verses=test_verse
            )
            
            return {
                "status": "degraded",
                "gemini_api": "unavailable",
                "fallback": "operational",
                "error": str(e),
                "message": "Gemini API unavailable, but fallback templates are working"
            }
        except:
            return {
                "status": "unhealthy",
                "gemini_api": "unavailable", 
                "fallback": "failed",
                "error": str(e),
                "message": "Reflection generation service is not operational"
            }