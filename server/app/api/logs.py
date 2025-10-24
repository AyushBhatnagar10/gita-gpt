from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import date, datetime
import uuid

from app.db.database import get_db
from app.core.auth import require_auth, check_user_access
from app.models.user import User
from app.services.logging_service import LoggingService
from app.schemas.emotion_log import (
    EmotionLogCreate, 
    EmotionLogResponse, 
    MoodCalendarEntry, 
    MoodCalendarResponse
)

router = APIRouter(prefix="/logs", tags=["logs"])


def get_logging_service(db: Session = Depends(get_db)) -> LoggingService:
    """Dependency to get LoggingService instance."""
    return LoggingService(db)


@router.post("/interaction", response_model=EmotionLogResponse)
async def log_interaction(
    user_input: str,
    emotion_data: Dict[str, Any],
    verse_ids: List[str],
    session_id: Optional[uuid.UUID] = None,
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> EmotionLogResponse:
    """
    Log user interaction for mood tracking.
    
    This endpoint stores the user's interaction data including their input,
    detected emotions, and the verses that were shown to them.
    
    - **user_id**: UUID of the user
    - **user_input**: The user's original input text
    - **emotion_data**: Dictionary containing emotion detection results
    - **verse_ids**: List of verse IDs that were displayed
    - **session_id**: Optional conversation session ID
    
    The emotion_data should contain:
    - dominant: Dict with label, confidence, emoji, color
    - emotions: List of all detected emotions
    
    Returns the created emotion log entry with all stored information.
    """
    try:
        # Validate emotion_data structure
        if not isinstance(emotion_data, dict):
            raise HTTPException(
                status_code=400,
                detail="emotion_data must be a dictionary"
            )
        
        if "dominant" not in emotion_data:
            raise HTTPException(
                status_code=400,
                detail="emotion_data must contain 'dominant' key"
            )
        
        # Log the interaction
        emotion_log = await logging_service.log_interaction(
            user_id=current_user.id,
            user_input=user_input,
            emotion_data=emotion_data,
            verse_ids=verse_ids,
            session_id=session_id
        )
        
        return EmotionLogResponse.from_orm(emotion_log)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to log interaction: {str(e)}"
        )


@router.get("/mood", response_model=MoodCalendarResponse)
async def get_mood_data(
    start_date: date = Query(..., description="Start date for mood data (YYYY-MM-DD)"),
    end_date: date = Query(..., description="End date for mood data (YYYY-MM-DD)"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> MoodCalendarResponse:
    """
    Retrieve mood data for calendar display.
    
    This endpoint returns mood entries for the specified date range,
    suitable for displaying in a calendar interface.
    
    - **user_id**: UUID of the user
    - **start_date**: Start date for the range (inclusive)
    - **end_date**: End date for the range (inclusive)
    
    Returns a list of mood entries with:
    - Date, emotion, emoji, color
    - Confidence score
    - Associated verse IDs
    - Summary of the user's input
    
    Each date will have at most one entry representing the dominant
    emotion for that day (most recent if multiple interactions).
    """
    try:
        # Validate date range
        if start_date > end_date:
            raise HTTPException(
                status_code=400,
                detail="start_date must be before or equal to end_date"
            )
        
        # Limit date range to prevent excessive queries
        date_diff = (end_date - start_date).days
        if date_diff > 365:
            raise HTTPException(
                status_code=400,
                detail="Date range cannot exceed 365 days"
            )
        
        # Get mood data
        mood_entries = await logging_service.get_mood_data(
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date
        )
        
        return MoodCalendarResponse(
            entries=mood_entries,
            start_date=start_date,
            end_date=end_date
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve mood data: {str(e)}"
        )


@router.get("/mood/month")
async def get_monthly_mood_data(
    year: int = Query(..., description="Year (e.g., 2024)"),
    month: int = Query(..., ge=1, le=12, description="Month (1-12)"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> MoodCalendarResponse:
    """
    Convenience endpoint to get mood data for a specific month.
    
    - **user_id**: UUID of the user
    - **year**: Year (e.g., 2024)
    - **month**: Month (1-12)
    
    Returns mood data for the entire specified month.
    """
    try:
        # Calculate start and end dates for the month
        from calendar import monthrange
        
        start_date = date(year, month, 1)
        _, last_day = monthrange(year, month)
        end_date = date(year, month, last_day)
        
        # Get mood data for the month
        mood_entries = await logging_service.get_mood_data(
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date
        )
        
        return MoodCalendarResponse(
            entries=mood_entries,
            start_date=start_date,
            end_date=end_date
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid date: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve monthly mood data: {str(e)}"
        )


@router.get("/health")
async def logs_service_health(
    logging_service: LoggingService = Depends(get_logging_service)
) -> dict:
    """
    Health check endpoint for the logging service.
    
    Returns the status of the logging service and database connectivity.
    """
    try:
        # Test database connectivity by attempting a simple query
        from app.models.emotion_log import EmotionLog
        
        # Count total emotion logs (this tests DB connectivity)
        total_logs = logging_service.db.query(EmotionLog).count()
        
        return {
            "status": "healthy",
            "database_connected": True,
            "total_emotion_logs": total_logs,
            "message": "Logging service is operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database_connected": False,
            "error": str(e),
            "message": "Logging service is not operational"
        }