"""
Intent Classification Service for routing user queries.

Classifies user input into three categories:
- casual_chat: Greetings, small talk, factual questions
- emotional_query: Emotional struggles requiring empathy and verse guidance
- spiritual_guidance: Philosophical questions about Gita teachings
"""
from transformers import pipeline
from typing import Dict, Tuple
from app.core.config import settings
import re


class IntentClassificationService:
    """
    Intent classification service using zero-shot classification.
    
    Routes user queries to appropriate processing pipelines:
    - casual_chat → Direct Gemini chat (no emotion/verse search)
    - emotional_query → Full pipeline (emotion + verse + Gemini)
    - spiritual_guidance → Verse search + Gemini (skip emotion)
    """
    
    # Intent labels and their descriptions
    INTENT_LABELS = {
        "casual_chat": "greeting, small talk, general conversation, factual question, introduction",
        "emotional_query": "expressing sadness, anxiety, stress, confusion, guilt, emotional struggle, seeking comfort",
        "spiritual_guidance": "philosophical question, seeking wisdom, asking about dharma, karma, or Bhagavad Gita teachings"
    }
    
    # Rule-based patterns for quick classification
    CASUAL_PATTERNS = [
        r"^(hi|hello|hey|namaste|good morning|good evening|good afternoon)\b",
        r"^(who are you|what are you|what is this|how does this work)\b",
        r"^(thank you|thanks|bye|goodbye)\b",
    ]
    
    def __init__(self):
        """Initialize zero-shot classification pipeline."""
        try:
            # Use BART for zero-shot classification
            model_name = getattr(settings, 'INTENT_MODEL', 'facebook/bart-large-mnli')
            self.classifier = pipeline(
                "zero-shot-classification",
                model=model_name,
                device=-1  # CPU
            )
            self.confidence_threshold = getattr(settings, 'INTENT_CONFIDENCE_THRESHOLD', 0.6)
            print(f"Intent classification service initialized with model: {model_name}")
        except Exception as e:
            print(f"Warning: Could not initialize intent classifier: {e}")
            self.classifier = None
    
    def classify_intent(self, user_input: str) -> Tuple[str, float]:
        """
        Classify user input into one of three intents.
        
        Args:
            user_input: User's message text
            
        Returns:
            Tuple of (intent_label, confidence_score)
            
        Example:
            >>> service.classify_intent("I'm feeling very anxious about my future")
            ('emotional_query', 0.89)
            
            >>> service.classify_intent("What does Krishna say about dharma?")
            ('spiritual_guidance', 0.92)
            
            >>> service.classify_intent("Hello, how are you?")
            ('casual_chat', 0.95)
        """
        # Quick rule-based check for common casual patterns
        if self._is_casual_by_rules(user_input):
            return ("casual_chat", 0.95)
        
        # If classifier not available, use heuristics
        if not self.classifier:
            return self._classify_by_heuristics(user_input)
        
        try:
            # Prepare candidate labels with descriptions
            candidate_labels = list(self.INTENT_LABELS.keys())
            
            # Run zero-shot classification
            result = self.classifier(
                user_input,
                candidate_labels,
                hypothesis_template="This text is about {}",
                multi_label=False
            )
            
            # Extract top prediction
            intent = result['labels'][0]
            confidence = result['scores'][0]
            
            # If confidence is below threshold, default to casual_chat
            if confidence < self.confidence_threshold:
                return ("casual_chat", confidence)
            
            return (intent, confidence)
            
        except Exception as e:
            print(f"Error in intent classification: {e}")
            # Fallback to heuristics
            return self._classify_by_heuristics(user_input)
    
    def _is_casual_by_rules(self, text: str) -> bool:
        """
        Check if text matches casual conversation patterns.
        
        Args:
            text: Input text
            
        Returns:
            True if matches casual patterns
        """
        text_lower = text.lower().strip()
        
        # Check against regex patterns
        for pattern in self.CASUAL_PATTERNS:
            if re.match(pattern, text_lower, re.IGNORECASE):
                return True
        
        # Check for very short inputs (likely greetings)
        if len(text_lower.split()) <= 3 and any(
            word in text_lower for word in ['hi', 'hello', 'hey', 'thanks', 'bye']
        ):
            return True
        
        return False
    
    def _classify_by_heuristics(self, text: str) -> Tuple[str, float]:
        """
        Fallback classification using keyword heuristics.
        
        Args:
            text: Input text
            
        Returns:
            Tuple of (intent, confidence)
        """
        text_lower = text.lower()
        
        # Emotional keywords
        emotional_keywords = [
            'feel', 'feeling', 'anxious', 'worried', 'sad', 'depressed',
            'stressed', 'confused', 'guilty', 'angry', 'frustrated',
            'overwhelmed', 'scared', 'afraid', 'hurt', 'pain', 'suffering'
        ]
        
        # Spiritual keywords
        spiritual_keywords = [
            'dharma', 'karma', 'krishna', 'arjuna', 'gita', 'bhagavad',
            'yoga', 'meditation', 'enlightenment', 'moksha', 'atman',
            'brahman', 'duty', 'purpose', 'meaning', 'wisdom', 'teaching'
        ]
        
        # Count keyword matches
        emotional_score = sum(1 for kw in emotional_keywords if kw in text_lower)
        spiritual_score = sum(1 for kw in spiritual_keywords if kw in text_lower)
        
        # Determine intent based on scores
        if emotional_score > spiritual_score and emotional_score > 0:
            return ("emotional_query", 0.7)
        elif spiritual_score > 0:
            return ("spiritual_guidance", 0.7)
        else:
            return ("casual_chat", 0.6)
    
    def get_intent_description(self, intent: str) -> str:
        """
        Get human-readable description of intent.
        
        Args:
            intent: Intent label
            
        Returns:
            Description string
        """
        descriptions = {
            "casual_chat": "General conversation or greeting",
            "emotional_query": "Emotional support needed",
            "spiritual_guidance": "Seeking spiritual wisdom"
        }
        return descriptions.get(intent, "Unknown intent")


# Singleton instance
_intent_service = None


def get_intent_service() -> IntentClassificationService:
    """Get or create singleton intent classification service instance."""
    global _intent_service
    if _intent_service is None:
        _intent_service = IntentClassificationService()
    return _intent_service
