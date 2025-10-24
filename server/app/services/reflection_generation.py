import google.generativeai as genai
from typing import Dict, List, Optional
from app.core.config import settings


class ReflectionGenerationService:
    """
    Reflection generation service using Google Gemini API.
    
    Generates empathetic reflections that connect Bhagavad Gita verses
    to users' specific situations and emotional states across three modes:
    - Socratic: Reflection-focused with guiding questions
    - Wisdom: Direct interpretation with actionable insights  
    - Story: Narrative context from Mahabharata
    """
    
    def __init__(self):
        """Initialize Gemini API client."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.LLM_MODEL)
        
        # Prompt templates for different interaction modes
        self.prompts = {
            "socratic": self._get_socratic_prompt(),
            "wisdom": self._get_wisdom_prompt(),
            "story": self._get_story_prompt()
        }
    
    def generate_reflection(
        self,
        user_input: str,
        emotion_data: Dict,
        verses: List[Dict],
        interaction_mode: str = "wisdom",
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate empathetic reflection linking verses to user's situation.
        
        Args:
            user_input: User's original message
            emotion_data: Detected emotion with confidence, emoji, color
            verses: List of relevant verses from vector search
            interaction_mode: One of 'socratic', 'wisdom', 'story'
            conversation_history: Recent conversation context
            
        Returns:
            Generated reflection text with verse and commentary
            
        Raises:
            ValueError: If interaction_mode is invalid
            Exception: If Gemini API fails (should be handled by caller)
        """
        if interaction_mode not in self.prompts:
            raise ValueError(f"Invalid interaction mode: {interaction_mode}. Must be one of: {list(self.prompts.keys())}")
        
        if not verses:
            raise ValueError("At least one verse is required for reflection generation")
        
        try:
            # Build the prompt with user context
            prompt = self._build_prompt(
                user_input=user_input,
                emotion_data=emotion_data,
                verses=verses,
                interaction_mode=interaction_mode,
                conversation_history=conversation_history or []
            )
            
            # Generate reflection using Gemini
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise Exception("Empty response from Gemini API")
                
            return response.text.strip()
            
        except Exception as e:
            # Re-raise for caller to handle with fallback
            raise Exception(f"Gemini API error: {str(e)}")
    
    def _build_prompt(
        self,
        user_input: str,
        emotion_data: Dict,
        verses: List[Dict],
        interaction_mode: str,
        conversation_history: List[Dict]
    ) -> str:
        """
        Build mode-specific prompt with user context.
        
        Args:
            user_input: User's message
            emotion_data: Emotion detection results
            verses: Retrieved verses
            interaction_mode: Selected mode
            conversation_history: Recent messages
            
        Returns:
            Formatted prompt string
        """
        # Use the primary verse (first in list)
        primary_verse = verses[0]
        
        # Format conversation history
        history_text = self._format_conversation_history(conversation_history)
        
        # Get the appropriate prompt template
        prompt_template = self.prompts[interaction_mode]
        
        # Format the prompt with context
        return prompt_template.format(
            emotion=emotion_data.get("label", "neutral"),
            confidence=emotion_data.get("confidence", 0.5),
            user_input=user_input,
            verse_sanskrit=primary_verse.get("shloka", ""),
            verse_english=primary_verse.get("engMeaning", ""),
            verse_reference=f"Chapter {primary_verse.get('chapter', '')}, Verse {primary_verse.get('verse', '')}",
            conversation_history=history_text
        )
    
    def _format_conversation_history(self, history: List[Dict]) -> str:
        """
        Format conversation history for prompt context.
        
        Args:
            history: List of recent messages
            
        Returns:
            Formatted history string
        """
        if not history:
            return "This is the beginning of our conversation."
        
        formatted_messages = []
        for msg in history[-3:]:  # Last 3 messages for context
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            formatted_messages.append(f"{role.title()}: {content}")
        
        return "\n".join(formatted_messages)
    
    def _get_socratic_prompt(self) -> str:
        """Get Socratic mode prompt template."""
        return """You are a compassionate spiritual guide inspired by the Bhagavad Gita.

User's emotional state: {emotion} (confidence: {confidence})
User's message: {user_input}

Relevant verse ({verse_reference}):
Sanskrit: {verse_sanskrit}
English: {verse_english}

Previous context: {conversation_history}

Respond in Socratic mode:
1. Acknowledge their emotion with empathy
2. Present the verse in Sanskrit (Devanagari) and English
3. Ask reflective questions that guide them to discover insights
4. Connect the verse wisdom to their situation through questions
5. Maintain a gentle, non-judgmental tone

Format your response with clear sections for the verse and reflection."""
    
    def _get_wisdom_prompt(self) -> str:
        """Get Wisdom mode prompt template."""
        return """You are a compassionate spiritual guide inspired by the Bhagavad Gita.

User's emotional state: {emotion} (confidence: {confidence})
User's message: {user_input}

Relevant verse ({verse_reference}):
Sanskrit: {verse_sanskrit}
English: {verse_english}

Previous context: {conversation_history}

Respond in Wisdom mode:
1. Acknowledge their emotion with empathy
2. Present the verse in Sanskrit (Devanagari) and English
3. Provide direct, clear interpretation of the verse
4. Explain how this wisdom applies to their situation
5. Offer actionable insights or perspectives
6. Maintain a compassionate, supportive tone

Format your response with clear sections for the verse and reflection."""
    
    def _get_story_prompt(self) -> str:
        """Get Story mode prompt template."""
        return """You are a compassionate spiritual guide inspired by the Bhagavad Gita.

User's emotional state: {emotion} (confidence: {confidence})
User's message: {user_input}

Relevant verse ({verse_reference}):
Sanskrit: {verse_sanskrit}
English: {verse_english}

Previous context: {conversation_history}

Respond in Story mode:
1. Acknowledge their emotion with empathy
2. Present the verse in Sanskrit (Devanagari) and English
3. Share the narrative context from the Mahabharata or verse background
4. Weave their situation into the story's lessons
5. Draw parallels between the ancient narrative and their modern experience
6. Maintain an engaging, relatable tone

Format your response with clear sections for the verse and reflection."""
    
    def generate_fallback_reflection(
        self,
        user_input: str,
        emotion_data: Dict,
        verses: List[Dict]
    ) -> str:
        """
        Generate basic template-based reflection when Gemini API fails.
        
        Args:
            user_input: User's message
            emotion_data: Detected emotion
            verses: Retrieved verses
            
        Returns:
            Template-based reflection
        """
        if not verses:
            return "I understand you're seeking guidance. While I'm having technical difficulties, please know that every challenge is an opportunity for growth and self-reflection."
        
        verse = verses[0]
        emotion_label = emotion_data.get("label", "seeking")
        
        return f"""I sense you're feeling {emotion_label}, and I want you to know that your feelings are valid.

**Verse {verse.get('chapter', '')}.{verse.get('verse', '')}:**

Sanskrit: {verse.get('shloka', '')}

English: {verse.get('engMeaning', '')}

This ancient wisdom reminds us that all emotions are temporary and serve as teachers on our spiritual journey. The Bhagavad Gita teaches us to observe our feelings with compassion while staying connected to our deeper purpose.

Take a moment to breathe deeply and reflect on how this verse might offer guidance for your current situation."""


# Singleton instance
_reflection_service = None

def get_reflection_service() -> ReflectionGenerationService:
    """Get or create singleton reflection generation service instance."""
    global _reflection_service
    if _reflection_service is None:
        _reflection_service = ReflectionGenerationService()
    return _reflection_service