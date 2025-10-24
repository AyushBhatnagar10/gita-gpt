from pydantic import BaseModel, Field
from typing import List


class EmotionData(BaseModel):
    """Individual emotion data with metadata."""
    label: str = Field(..., description="Emotion label (e.g., 'joy', 'sadness')")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    emoji: str = Field(..., description="Emoji representation of the emotion")
    color: str = Field(..., description="Hex color code for UI display")


class EmotionRequest(BaseModel):
    """Request model for emotion detection."""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to analyze for emotions")
    threshold: float = Field(0.3, ge=0.0, le=1.0, description="Minimum confidence threshold")


class EmotionResponse(BaseModel):
    """Response model for emotion detection."""
    emotions: List[EmotionData] = Field(..., description="List of detected emotions above threshold")
    dominant: EmotionData = Field(..., description="Emotion with highest confidence")
    
    class Config:
        json_schema_extra = {
            "example": {
                "emotions": [
                    {
                        "label": "gratitude",
                        "confidence": 0.92,
                        "emoji": "🙏",
                        "color": "#FEF3C7"
                    },
                    {
                        "label": "joy",
                        "confidence": 0.45,
                        "emoji": "😊",
                        "color": "#FEF3C7"
                    }
                ],
                "dominant": {
                    "label": "gratitude",
                    "confidence": 0.92,
                    "emoji": "🙏",
                    "color": "#FEF3C7"
                }
            }
        }