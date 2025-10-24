from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract, desc
from typing import List, Dict, Optional, Any
from datetime import date, datetime, timedelta
from collections import Counter, defaultdict
import uuid

from app.models.emotion_log import EmotionLog
from app.models.user import User
from app.schemas.emotion_log import EmotionLogCreate, MoodCalendarEntry
import logging

logger = logging.getLogger(__name__)


class LoggingService:
    """Service for logging user interactions and providing mood tracking analytics."""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def log_interaction(
        self,
        user_id: uuid.UUID,
        user_input: str,
        emotion_data: Dict[str, Any],
        verse_ids: List[str],
        session_id: Optional[uuid.UUID] = None
    ) -> EmotionLog:
        """
        Log user interaction for mood tracking.
        
        Args:
            user_id: UUID of the user
            user_input: The user's input text
            emotion_data: Dictionary containing emotion information
            verse_ids: List of verse IDs that were shown
            session_id: Optional conversation session ID
            
        Returns:
            EmotionLog: The created emotion log entry
        """
        try:
            # Extract emotion information from emotion_data
            dominant_emotion = emotion_data.get('dominant', {})
            all_emotions = emotion_data.get('emotions', [])
            
            # Create emotion log entry
            emotion_log = EmotionLog(
                user_id=user_id,
                log_date=date.today(),
                user_input=user_input,
                dominant_emotion=dominant_emotion.get('label', 'neutral'),
                emotion_confidence=dominant_emotion.get('confidence', 0.0),
                emotion_emoji=dominant_emotion.get('emoji', '😐'),
                emotion_color=dominant_emotion.get('color', '#F3F4F6'),
                all_emotions=all_emotions,
                verse_ids=verse_ids,
                session_id=session_id
            )
            
            self.db.add(emotion_log)
            self.db.commit()
            self.db.refresh(emotion_log)
            
            logger.info(f"Logged interaction for user {user_id} with emotion {dominant_emotion.get('label')}")
            return emotion_log
            
        except Exception as e:
            logger.error(f"Error logging interaction: {e}")
            self.db.rollback()
            raise
    
    async def get_mood_data(
        self,
        user_id: uuid.UUID,
        start_date: date,
        end_date: date
    ) -> List[MoodCalendarEntry]:
        """
        Retrieve mood data for calendar display.
        
        Args:
            user_id: UUID of the user
            start_date: Start date for the range
            end_date: End date for the range
            
        Returns:
            List[MoodCalendarEntry]: List of mood entries for the date range
        """
        try:
            # Query emotion logs for the date range
            emotion_logs = self.db.query(EmotionLog).filter(
                and_(
                    EmotionLog.user_id == user_id,
                    EmotionLog.log_date >= start_date,
                    EmotionLog.log_date <= end_date
                )
            ).order_by(EmotionLog.log_date.desc(), EmotionLog.created_at.desc()).all()
            
            # Group by date and get the dominant emotion for each day
            daily_emotions = {}
            for log in emotion_logs:
                log_date = log.log_date
                if log_date not in daily_emotions:
                    # Use the first (most recent) emotion for each day
                    daily_emotions[log_date] = {
                        'emotion': log.dominant_emotion,
                        'emoji': log.emotion_emoji,
                        'color': log.emotion_color,
                        'confidence': log.emotion_confidence,
                        'verse_ids': log.verse_ids or [],
                        'user_input': log.user_input,
                        'all_emotions': log.all_emotions or []
                    }
                else:
                    # Merge verse_ids from multiple interactions on the same day
                    existing_verse_ids = set(daily_emotions[log_date]['verse_ids'])
                    new_verse_ids = set(log.verse_ids or [])
                    daily_emotions[log_date]['verse_ids'] = list(existing_verse_ids.union(new_verse_ids))
            
            # Convert to MoodCalendarEntry objects
            mood_entries = []
            for log_date, data in daily_emotions.items():
                # Create a summary from the user input (first 100 characters)
                summary = data['user_input'][:100] + "..." if len(data['user_input']) > 100 else data['user_input']
                
                entry = MoodCalendarEntry(
                    date=log_date,
                    emotion=data['emotion'],
                    emoji=data['emoji'],
                    color=data['color'],
                    confidence=data['confidence'],
                    verse_ids=data['verse_ids'],
                    summary=summary,
                    all_emotions=data['all_emotions']
                )
                mood_entries.append(entry)
            
            # Sort by date
            mood_entries.sort(key=lambda x: x.date, reverse=True)
            
            logger.info(f"Retrieved {len(mood_entries)} mood entries for user {user_id}")
            return mood_entries
            
        except Exception as e:
            logger.error(f"Error retrieving mood data: {e}")
            raise
    
    async def get_emotion_stats(
        self,
        user_id: uuid.UUID,
        time_range: str = "month"
    ) -> Dict[str, Any]:
        """
        Calculate emotion statistics for analytics.
        
        Args:
            user_id: UUID of the user
            time_range: Time range for analysis ('week', 'month', 'quarter')
            
        Returns:
            Dict containing emotion statistics and trends
        """
        try:
            # Calculate date range based on time_range
            end_date = date.today()
            if time_range == "week":
                start_date = end_date - timedelta(days=7)
            elif time_range == "month":
                start_date = end_date - timedelta(days=30)
            elif time_range == "quarter":
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=30)  # Default to month
            
            # Query emotion logs for the time range
            emotion_logs = self.db.query(EmotionLog).filter(
                and_(
                    EmotionLog.user_id == user_id,
                    EmotionLog.log_date >= start_date,
                    EmotionLog.log_date <= end_date
                )
            ).all()
            
            if not emotion_logs:
                return {
                    "emotion_counts": {},
                    "total_interactions": 0,
                    "time_range": time_range,
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "weekly_trends": [],
                    "daily_averages": {}
                }
            
            # Count emotions
            emotion_counts = Counter(log.dominant_emotion for log in emotion_logs)
            
            # Calculate weekly trends
            weekly_trends = []
            current_date = start_date
            while current_date <= end_date:
                week_end = min(current_date + timedelta(days=6), end_date)
                week_logs = [
                    log for log in emotion_logs 
                    if current_date <= log.log_date <= week_end
                ]
                week_emotions = Counter(log.dominant_emotion for log in week_logs)
                
                weekly_trends.append({
                    "week_start": current_date.isoformat(),
                    "week_end": week_end.isoformat(),
                    "emotions": dict(week_emotions),
                    "total_interactions": len(week_logs)
                })
                
                current_date = week_end + timedelta(days=1)
            
            # Calculate daily averages by day of week
            daily_emotions = defaultdict(list)
            for log in emotion_logs:
                day_of_week = log.log_date.strftime('%A')
                daily_emotions[day_of_week].append(log.dominant_emotion)
            
            daily_averages = {}
            for day, emotions in daily_emotions.items():
                emotion_counter = Counter(emotions)
                most_common = emotion_counter.most_common(1)
                if most_common:
                    daily_averages[day] = {
                        "most_common_emotion": most_common[0][0],
                        "count": most_common[0][1],
                        "total_interactions": len(emotions)
                    }
            
            stats = {
                "emotion_counts": dict(emotion_counts),
                "total_interactions": len(emotion_logs),
                "time_range": time_range,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "weekly_trends": weekly_trends,
                "daily_averages": daily_averages
            }
            
            logger.info(f"Generated emotion stats for user {user_id}: {len(emotion_logs)} interactions")
            return stats
            
        except Exception as e:
            logger.error(f"Error calculating emotion stats: {e}")
            raise
    
    async def identify_patterns(
        self,
        user_id: uuid.UUID,
        time_range: str = "month"
    ) -> List[Dict[str, Any]]:
        """
        Identify emotional patterns and trends.
        
        Args:
            user_id: UUID of the user
            time_range: Time range for analysis ('week', 'month', 'quarter')
            
        Returns:
            List of identified patterns with suggestions
        """
        try:
            # Get emotion stats first
            stats = await self.get_emotion_stats(user_id, time_range)
            
            patterns = []
            
            # Pattern 1: Most frequent emotion
            emotion_counts = stats.get("emotion_counts", {})
            if emotion_counts:
                most_frequent = max(emotion_counts.items(), key=lambda x: x[1])
                if most_frequent[1] >= 3:  # At least 3 occurrences
                    patterns.append({
                        "pattern": f"Your most frequent emotion is {most_frequent[0]} ({most_frequent[1]} times)",
                        "type": "frequency",
                        "emotion": most_frequent[0],
                        "count": most_frequent[1],
                        "suggestion": self._get_emotion_suggestion(most_frequent[0]),
                        "verse_themes": self._get_verse_themes_for_emotion(most_frequent[0])
                    })
            
            # Pattern 2: Day of week patterns
            daily_averages = stats.get("daily_averages", {})
            if daily_averages:
                # Find days with consistent emotions
                for day, data in daily_averages.items():
                    if data["count"] >= 2:  # At least 2 occurrences on this day
                        patterns.append({
                            "pattern": f"You tend to feel {data['most_common_emotion']} on {day}s",
                            "type": "temporal",
                            "day": day,
                            "emotion": data["most_common_emotion"],
                            "count": data["count"],
                            "suggestion": f"Consider planning {self._get_day_suggestion(data['most_common_emotion'])} activities on {day}s",
                            "verse_themes": self._get_verse_themes_for_emotion(data["most_common_emotion"])
                        })
            
            # Pattern 3: Trend analysis
            weekly_trends = stats.get("weekly_trends", [])
            if len(weekly_trends) >= 2:
                # Compare first and last week
                first_week = weekly_trends[0]
                last_week = weekly_trends[-1]
                
                first_week_total = first_week.get("total_interactions", 0)
                last_week_total = last_week.get("total_interactions", 0)
                
                if first_week_total > 0 and last_week_total > 0:
                    # Check for increasing positive emotions
                    positive_emotions = ["joy", "gratitude", "love", "optimism", "relief", "pride"]
                    
                    first_positive = sum(
                        first_week["emotions"].get(emotion, 0) 
                        for emotion in positive_emotions
                    )
                    last_positive = sum(
                        last_week["emotions"].get(emotion, 0) 
                        for emotion in positive_emotions
                    )
                    
                    if last_positive > first_positive:
                        patterns.append({
                            "pattern": "Your positive emotions have increased over time",
                            "type": "trend",
                            "trend": "positive_increase",
                            "suggestion": "Keep up the positive momentum! Continue your spiritual practice",
                            "verse_themes": ["gratitude", "devotion", "joy"]
                        })
                    elif first_positive > last_positive and last_positive > 0:
                        patterns.append({
                            "pattern": "You may be experiencing some challenges lately",
                            "type": "trend",
                            "trend": "positive_decrease",
                            "suggestion": "Consider focusing on verses about resilience and inner strength",
                            "verse_themes": ["resilience", "strength", "hope"]
                        })
            
            # Pattern 4: Emotional diversity
            unique_emotions = len(emotion_counts)
            total_interactions = stats.get("total_interactions", 0)
            
            if total_interactions >= 5:
                if unique_emotions >= 5:
                    patterns.append({
                        "pattern": f"You experience a wide range of emotions ({unique_emotions} different emotions)",
                        "type": "diversity",
                        "diversity_score": unique_emotions / total_interactions,
                        "suggestion": "Your emotional awareness is developing well. Continue exploring different aspects of your inner life",
                        "verse_themes": ["self_awareness", "emotional_balance"]
                    })
                elif unique_emotions <= 2:
                    patterns.append({
                        "pattern": "You tend to experience similar emotions repeatedly",
                        "type": "diversity",
                        "diversity_score": unique_emotions / total_interactions,
                        "suggestion": "Consider exploring different situations or perspectives to broaden your emotional experience",
                        "verse_themes": ["growth", "exploration", "balance"]
                    })
            
            logger.info(f"Identified {len(patterns)} patterns for user {user_id}")
            return patterns
            
        except Exception as e:
            logger.error(f"Error identifying patterns: {e}")
            raise
    
    def _get_emotion_suggestion(self, emotion: str) -> str:
        """Get suggestion based on emotion."""
        suggestions = {
            "joy": "Embrace this positive energy and share it with others",
            "gratitude": "Continue cultivating thankfulness in your daily life",
            "love": "Let this love guide your actions and relationships",
            "sadness": "Allow yourself to feel this emotion while seeking wisdom for healing",
            "anger": "Channel this energy into positive action and self-reflection",
            "fear": "Face your fears with courage and seek divine guidance",
            "anxiety": "Practice surrender and trust in the divine plan",
            "confusion": "Seek clarity through meditation and spiritual study",
            "neutral": "Use this balanced state to deepen your spiritual practice"
        }
        return suggestions.get(emotion, "Reflect on this emotion and seek wisdom from the Gita")
    
    def _get_day_suggestion(self, emotion: str) -> str:
        """Get day-specific suggestion based on emotion."""
        if emotion in ["joy", "gratitude", "love", "optimism"]:
            return "uplifting and social"
        elif emotion in ["sadness", "fear", "anxiety"]:
            return "calming and reflective"
        elif emotion in ["anger", "frustration"]:
            return "physical exercise or creative"
        else:
            return "mindful and balanced"
    
    def _get_verse_themes_for_emotion(self, emotion: str) -> List[str]:
        """Get relevant verse themes for an emotion."""
        theme_mapping = {
            "joy": ["gratitude", "devotion", "celebration"],
            "gratitude": ["thankfulness", "devotion", "appreciation"],
            "love": ["devotion", "compassion", "unity"],
            "sadness": ["hope", "resilience", "comfort"],
            "anger": ["equanimity", "self_control", "forgiveness"],
            "fear": ["courage", "protection", "faith"],
            "anxiety": ["surrender", "trust", "peace"],
            "confusion": ["clarity", "wisdom", "guidance"],
            "neutral": ["balance", "mindfulness", "awareness"]
        }
        return theme_mapping.get(emotion, ["wisdom", "guidance"])