from fastapi import APIRouter, HTTPException, Depends
from app.schemas.emotion import EmotionRequest, EmotionResponse, EmotionData
from app.services.emotion_detection import get_emotion_service, EmotionDetectionService
from typing import List

router = APIRouter(prefix="/emotions", tags=["emotions"])


@router.post("/detect", response_model=EmotionResponse)
async def detect_emotion(
    request: EmotionRequest,
    emotion_service: EmotionDetectionService = Depends(get_emotion_service)
) -> EmotionResponse:
    """
    Detect emotions from text input using ONNX-optimized RoBERTa model.
    
    This endpoint analyzes the provided text and returns detected emotions
    with confidence scores, emojis, and color codes for UI display.
    
    - **text**: The text to analyze (1-5000 characters)
    - **threshold**: Minimum confidence threshold (default: 0.3)
    
    Returns emotions sorted by confidence (highest first) and the dominant emotion.
    If no emotions are detected above the threshold, returns neutral emotion.
    
    The service uses an ONNX-optimized version of the RoBERTa-GoEmotions model
    for fast inference (~10-20x speedup compared to standard PyTorch).
    """
    try:
        # Detect emotions using the service
        emotions_data = emotion_service.detect_emotion(
            text=request.text,
            threshold=request.threshold
        )
        
        # Convert to Pydantic models
        emotions = [EmotionData(**emotion) for emotion in emotions_data]
        
        # Get dominant emotion
        dominant_emotion_data = emotion_service.get_dominant_emotion(emotions_data)
        dominant = EmotionData(**dominant_emotion_data)
        
        return EmotionResponse(
            emotions=emotions,
            dominant=dominant
        )
        
    except Exception as e:
        # Handle model loading errors with fallback to neutral emotion
        print(f"Error in emotion detection endpoint: {e}")
        
        # Return neutral emotion as fallback
        neutral_emotion = EmotionData(
            label="neutral",
            confidence=0.5,
            emoji="😐",
            color="#F3F4F6"
        )
        
        return EmotionResponse(
            emotions=[neutral_emotion],
            dominant=neutral_emotion
        )


@router.get("/health")
async def emotion_service_health(
    emotion_service: EmotionDetectionService = Depends(get_emotion_service)
) -> dict:
    """
    Health check endpoint for the emotion detection service.
    
    Returns the status of the emotion detection model and service.
    """
    try:
        # Test with a simple input
        test_result = emotion_service.detect_emotion("I am feeling good today")
        
        return {
            "status": "healthy",
            "model": "SamLowe/roberta-base-go_emotions-onnx",
            "test_detection": len(test_result) > 0,
            "message": "Emotion detection service is operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Emotion detection service is not operational"
        }