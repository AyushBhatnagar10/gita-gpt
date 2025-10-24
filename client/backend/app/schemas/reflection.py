from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.emotion import EmotionData
from app.schemas.verse import VerseSearchResult


class ConversationMessage(BaseModel):
    """Individual conversation message."""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: Optional[str] = Field(None, description="Message timestamp")


class ReflectionRequest(BaseModel):
    """Request model for reflection generation."""
    user_input: str = Field(..., min_length=1, max_length=5000, description="User's original message")
    emotion_data: EmotionData = Field(..., description="Detected emotion data")
    verses: List[VerseSearchResult] = Field(..., min_items=1, description="Relevant verses from search")
    interaction_mode: str = Field("wisdom", description="Interaction mode: 'socratic', 'wisdom', or 'story'")
    conversation_history: Optional[List[ConversationMessage]] = Field(
        None, 
        description="Recent conversation context (last 3-5 messages)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_input": "I'm feeling overwhelmed with all my responsibilities at work and home.",
                "emotion_data": {
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
                        "transliteration": "karmaṇy-evādhikāras te mā phaleṣhu kadāchana",
                        "eng_meaning": "You have a right to perform your prescribed duty, but not to the fruits of action.",
                        "similarity_score": 0.87
                    }
                ],
                "interaction_mode": "wisdom",
                "conversation_history": [
                    {
                        "role": "user",
                        "content": "I've been struggling with stress lately.",
                        "timestamp": "2025-10-22T10:00:00Z"
                    },
                    {
                        "role": "assistant", 
                        "content": "I understand that stress can feel overwhelming...",
                        "timestamp": "2025-10-22T10:01:00Z"
                    }
                ]
            }
        }


class ReflectionResponse(BaseModel):
    """Response model for reflection generation."""
    reflection: str = Field(..., description="Generated reflection with verse and commentary")
    verse_id: str = Field(..., description="ID of the primary verse used")
    interaction_mode: str = Field(..., description="Mode used for generation")
    fallback_used: bool = Field(False, description="Whether fallback template was used")
    
    class Config:
        json_schema_extra = {
            "example": {
                "reflection": "I can sense the weight of anxiety you're carrying, and I want you to know that feeling overwhelmed is a natural human response to life's demands...\n\n**Verse 2.47:**\n\nSanskrit: कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\n\nEnglish: You have a right to perform your prescribed duty, but not to the fruits of action...",
                "verse_id": "BG2.47",
                "interaction_mode": "wisdom",
                "fallback_used": False
            }
        }


class ReflectionError(BaseModel):
    """Error response for reflection generation."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Human-readable error message")
    fallback_reflection: Optional[str] = Field(None, description="Fallback reflection if available")