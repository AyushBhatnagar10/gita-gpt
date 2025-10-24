from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from enum import Enum
import uuid

from app.db.database import get_db
from app.core.auth import require_auth
from app.models.user import User
from app.services.logging_service import LoggingService

router = APIRouter(prefix="/analytics", tags=["analytics"])


class TimeRange(str, Enum):
    """Enum for valid time ranges."""
    week = "week"
    month = "month"
    quarter = "quarter"


def get_logging_service(db: Session = Depends(get_db)) -> LoggingService:
    """Dependency to get LoggingService instance."""
    return LoggingService(db)


@router.get("/stats")
async def get_emotion_stats(
    time_range: TimeRange = Query(TimeRange.month, description="Time range for statistics"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> Dict[str, Any]:
    """
    Get emotion statistics and trends for analytics dashboard.
    
    This endpoint provides comprehensive emotion analytics including:
    - Emotion frequency distribution
    - Weekly trends over the time period
    - Daily averages by day of week
    - Total interaction counts
    
    - **user_id**: UUID of the user
    - **time_range**: Time period for analysis (week/month/quarter)
    
    Returns detailed statistics suitable for charts and visualizations:
    - emotion_counts: Dictionary of emotion frequencies
    - weekly_trends: List of weekly emotion breakdowns
    - daily_averages: Most common emotion by day of week
    - total_interactions: Total number of logged interactions
    - time_range: The requested time range
    - start_date/end_date: Actual date range analyzed
    """
    try:
        # Get emotion statistics
        stats = await logging_service.get_emotion_stats(
            user_id=current_user.id,
            time_range=time_range.value
        )
        
        return stats
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve emotion statistics: {str(e)}"
        )


@router.get("/patterns")
async def get_emotion_patterns(
    time_range: TimeRange = Query(TimeRange.month, description="Time range for pattern analysis"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> List[Dict[str, Any]]:
    """
    Identify emotional patterns and provide insights.
    
    This endpoint analyzes the user's emotional data to identify patterns such as:
    - Most frequent emotions
    - Day-of-week patterns
    - Trends over time (increasing/decreasing positive emotions)
    - Emotional diversity analysis
    
    - **user_id**: UUID of the user
    - **time_range**: Time period for analysis (week/month/quarter)
    
    Returns a list of identified patterns, each containing:
    - pattern: Description of the identified pattern
    - type: Pattern category (frequency/temporal/trend/diversity)
    - suggestion: Actionable suggestion based on the pattern
    - verse_themes: Relevant verse themes for the pattern
    - Additional metadata specific to pattern type
    
    Patterns are ordered by relevance and significance.
    """
    try:
        # Identify patterns
        patterns = await logging_service.identify_patterns(
            user_id=current_user.id,
            time_range=time_range.value
        )
        
        return patterns
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to identify emotion patterns: {str(e)}"
        )


@router.get("/summary")
async def get_analytics_summary(
    time_range: TimeRange = Query(TimeRange.month, description="Time range for summary"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> Dict[str, Any]:
    """
    Get a comprehensive analytics summary combining stats and patterns.
    
    This endpoint provides a complete overview suitable for dashboard display,
    combining emotion statistics and identified patterns in a single response.
    
    - **user_id**: UUID of the user
    - **time_range**: Time period for analysis (week/month/quarter)
    
    Returns:
    - stats: Complete emotion statistics
    - patterns: List of identified patterns
    - insights: High-level insights and recommendations
    - metadata: Analysis metadata (date ranges, totals, etc.)
    """
    try:
        # Get both stats and patterns
        stats = await logging_service.get_emotion_stats(
            user_id=current_user.id,
            time_range=time_range.value
        )
        
        patterns = await logging_service.identify_patterns(
            user_id=current_user.id,
            time_range=time_range.value
        )
        
        # Generate high-level insights
        insights = _generate_insights(stats, patterns)
        
        return {
            "stats": stats,
            "patterns": patterns,
            "insights": insights,
            "metadata": {
                "user_id": str(current_user.id),
                "time_range": time_range.value,
                "analysis_date": stats.get("end_date"),
                "total_interactions": stats.get("total_interactions", 0),
                "patterns_found": len(patterns)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate analytics summary: {str(e)}"
        )


@router.get("/emotions/top")
async def get_top_emotions(
    time_range: TimeRange = Query(TimeRange.month, description="Time range for analysis"),
    limit: int = Query(5, ge=1, le=10, description="Number of top emotions to return"),
    current_user: User = Depends(require_auth),
    logging_service: LoggingService = Depends(get_logging_service)
) -> List[Dict[str, Any]]:
    """
    Get the top emotions by frequency for the user.
    
    - **user_id**: UUID of the user
    - **time_range**: Time period for analysis
    - **limit**: Maximum number of emotions to return (1-10)
    
    Returns a list of emotions sorted by frequency, each containing:
    - emotion: Emotion name
    - count: Number of occurrences
    - percentage: Percentage of total interactions
    - emoji: Associated emoji
    - color: Associated color code
    """
    try:
        # Get emotion statistics
        stats = await logging_service.get_emotion_stats(
            user_id=current_user.id,
            time_range=time_range.value
        )
        
        emotion_counts = stats.get("emotion_counts", {})
        total_interactions = stats.get("total_interactions", 0)
        
        if total_interactions == 0:
            return []
        
        # Sort emotions by count and take top N
        sorted_emotions = sorted(
            emotion_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:limit]
        
        # Add emoji and color information
        from app.services.emotion_detection import EmotionDetectionService
        emotion_service = EmotionDetectionService()
        
        top_emotions = []
        for emotion, count in sorted_emotions:
            emotion_info = emotion_service.emotion_emoji_map.get(emotion, {
                "emoji": "😐",
                "color": "#F3F4F6"
            })
            
            top_emotions.append({
                "emotion": emotion,
                "count": count,
                "percentage": round((count / total_interactions) * 100, 1),
                "emoji": emotion_info["emoji"],
                "color": emotion_info["color"]
            })
        
        return top_emotions
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve top emotions: {str(e)}"
        )


@router.get("/health")
async def analytics_service_health(
    logging_service: LoggingService = Depends(get_logging_service)
) -> dict:
    """
    Health check endpoint for the analytics service.
    
    Returns the status of the analytics service and its dependencies.
    """
    try:
        # Test by getting stats for a dummy user (this tests the service logic)
        dummy_user_id = uuid.uuid4()
        stats = await logging_service.get_emotion_stats(dummy_user_id, "week")
        
        return {
            "status": "healthy",
            "database_connected": True,
            "analytics_functional": True,
            "message": "Analytics service is operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Analytics service is not operational"
        }


def _generate_insights(stats: Dict[str, Any], patterns: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate high-level insights from stats and patterns."""
    insights = {
        "overall_mood": "neutral",
        "trend": "stable",
        "recommendations": [],
        "highlights": []
    }
    
    try:
        # Analyze overall mood based on emotion distribution
        emotion_counts = stats.get("emotion_counts", {})
        total_interactions = stats.get("total_interactions", 0)
        
        if total_interactions > 0:
            positive_emotions = ["joy", "gratitude", "love", "optimism", "relief", "pride", "admiration"]
            negative_emotions = ["sadness", "anger", "fear", "anxiety", "disappointment", "grief"]
            
            positive_count = sum(emotion_counts.get(emotion, 0) for emotion in positive_emotions)
            negative_count = sum(emotion_counts.get(emotion, 0) for emotion in negative_emotions)
            
            positive_ratio = positive_count / total_interactions
            negative_ratio = negative_count / total_interactions
            
            if positive_ratio > 0.6:
                insights["overall_mood"] = "positive"
            elif negative_ratio > 0.6:
                insights["overall_mood"] = "challenging"
            else:
                insights["overall_mood"] = "balanced"
        
        # Analyze trends from patterns
        trend_patterns = [p for p in patterns if p.get("type") == "trend"]
        if trend_patterns:
            for pattern in trend_patterns:
                if "positive_increase" in pattern.get("trend", ""):
                    insights["trend"] = "improving"
                elif "positive_decrease" in pattern.get("trend", ""):
                    insights["trend"] = "declining"
        
        # Generate recommendations based on patterns
        for pattern in patterns[:3]:  # Top 3 patterns
            if pattern.get("suggestion"):
                insights["recommendations"].append(pattern["suggestion"])
        
        # Generate highlights
        if emotion_counts:
            most_frequent = max(emotion_counts.items(), key=lambda x: x[1])
            insights["highlights"].append(f"Most frequent emotion: {most_frequent[0]} ({most_frequent[1]} times)")
        
        if total_interactions > 0:
            insights["highlights"].append(f"Total interactions: {total_interactions}")
        
        diversity_patterns = [p for p in patterns if p.get("type") == "diversity"]
        if diversity_patterns:
            insights["highlights"].append(diversity_patterns[0]["pattern"])
    
    except Exception as e:
        # If insight generation fails, return basic structure
        insights["error"] = f"Failed to generate insights: {str(e)}"
    
    return insights