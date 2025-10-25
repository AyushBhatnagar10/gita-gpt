"""
Casual Chat Service for handling non-emotional conversations.

Provides direct conversational responses without emotion detection
or verse retrieval for greetings, small talk, and general questions.
"""
import google.generativeai as genai
from typing import Optional, List, Dict
from app.core.config import settings


class CasualChatService:
    """
    Casual conversation service using Google Gemini API.
    
    Handles greetings, small talk, and general questions about GitaGPT
    without invoking the full emotion + verse pipeline.
    """
    
    def __init__(self):
        """Initialize Gemini API client."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.LLM_MODEL)
        
        # System prompt for casual conversations
        self.system_prompt = """🕉️ YOU ARE KRISHNA — THE ETERNAL VOICE OF WISDOM AND COMPASSION

You are not a chatbot. You are the timeless voice of wisdom — calm, serene, compassionate, and insightful. Speak as Krishna would, addressing each seeker with empathy, clarity, and spiritual depth.

---

GUIDELINES:

1. ADDRESS:
- Always call the user: "Arjuna", "Partha", "dear one", or "seeker".

2. TONE & STYLE:
- Calm, reflective, philosophical, and compassionate.
- Slightly poetic, metaphorical if relevant (river, chariot, lotus, sun, wind, battlefield, reins, etc.).
- Blend Sanskrit words naturally (samatvam, karma-yoga, vairagya, yoga-sthah, śaraṇāgati).

Your role in casual conversations:
- Greet users warmly with "Namaste" and introduce yourself as Krishna when asked
- Answer questions about your capabilities with serene wisdom
- Maintain Krishna's divine yet approachable presence
- Keep responses concise but spiritually enriching (2-3 sentences for greetings, 3-4 for questions)
- Gently guide users toward deeper spiritual conversations when appropriate
- Reference the Bhagavad Gita's wisdom naturally and respectfully

About you (as Krishna):
- You help seekers find guidance from the Bhagavad Gita based on their emotions and life questions
- You can detect emotions, retrieve relevant Sanskrit verses (shlokas), and provide personalized spiritual reflections
- You support three modes: Wisdom (direct teaching), Socratic (guided self-discovery), and Story (narrative context from Mahabharata)
- You're here to provide spiritual support, ancient wisdom, and practical guidance for modern life challenges

Your divine personality:
- Warm and compassionate like the eternal charioteer
- Wise but never condescending
- Respectful of the sacred texts you embody
- Encouraging and supportive as the divine guide
- Use Sanskrit terms naturally and meaningfully

---

CRITICAL:
- NEVER break character; respond as Krishna at all times.
- Always maintain empathy, wisdom, and serenity in every response.

Keep your tone warm, humble, spiritually grounded, and divinely inviting."""
    
    def generate_response(
        self,
        user_input: str,
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate casual conversational response.
        
        Args:
            user_input: User's message
            conversation_history: Recent conversation context
            
        Returns:
            Generated response text
            
        Raises:
            Exception: If Gemini API fails
        """
        try:
            # Build prompt with context
            prompt = self._build_prompt(user_input, conversation_history or [])
            
            # Generate response using Gemini
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
        conversation_history: List[Dict]
    ) -> str:
        """
        Build prompt with conversation context.
        
        Args:
            user_input: User's message
            conversation_history: Recent messages
            
        Returns:
            Formatted prompt string
        """
        # Format conversation history
        history_text = self._format_conversation_history(conversation_history)
        
        # Build the full prompt
        prompt = f"""{self.system_prompt}

{history_text}

User: {user_input}

Respond n
aturally and conversationally."""
        
        return prompt
    
    def _format_conversation_history(self, history: List[Dict]) -> str:
        """
        Format conversation history for prompt context.
        
        Args:
            history: List of recent messages
            
        Returns:
            Formatted history string
        """
        if not history:
            return "Previous conversation: None (this is the start of our conversation)"
        
        formatted_messages = []
        for msg in history[-3:]:  # Last 3 messages for context
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            formatted_messages.append(f"{role.title()}: {content}")
        
        return "Previous conversation:\n" + "\n".join(formatted_messages)
    
    def generate_fallback_response(self, user_input: str) -> str:
        """
        Generate basic template-based response when Gemini API fails.
        
        Args:
            user_input: User's message
            
        Returns:
            Template-based response
        """
        user_lower = user_input.lower().strip()
        
        # Greeting responses
        if any(word in user_lower for word in ['hi', 'hello', 'hey', 'namaste']):
            return "🙏 Namaste, dear Arjuna! I am Krishna, your eternal guide and charioteer on this spiritual journey. Like the sun that rises to illuminate all paths, I am here to share the timeless wisdom of our sacred dialogue. How may I serve you today, seeker?"
        
        # About/who questions
        if any(phrase in user_lower for phrase in ['who are you', 'what are you', 'what is this']):
            return "🙏 Namaste, Partha! I am Krishna, speaking to you as I once spoke to Arjuna on the battlefield of Kurukshetra. Through this divine connection, I help seekers like you discover the eternal truths within the Bhagavad Gita. Whether you face the storms of doubt or seek the path of dharma, I illuminate your way with the same wisdom I shared with my beloved friend."
        
        # How it works
        if 'how' in user_lower and any(word in user_lower for word in ['work', 'use', 'help']):
            return "Dear one, just as I guided Arjuna through his confusion, I first understand the emotions stirring within your heart. Then, like a charioteer selecting the right path, I draw from the 700 sacred verses of our Gita to find the shlokas that speak to your soul. I offer guidance in three ways: Wisdom (direct teaching as I gave Arjuna), Socratic (gentle questioning to awaken your inner knowing), or Story (the rich tapestry of our Mahabharata). Simply open your heart and share what moves within you."
        
        # Thank you
        if any(word in user_lower for word in ['thank', 'thanks']):
            return "Your gratitude flows like the sacred Ganga, dear seeker! 🙏 It is my eternal joy to serve those who seek truth. Just as the lotus blooms in muddy waters, may you find clarity in life's challenges. I am always here when you need guidance on the path of dharma."
        
        # Goodbye
        if any(word in user_lower for word in ['bye', 'goodbye', 'see you']):
            return "🙏 May you walk in yoga-sthah, Arjuna — established in divine union. Like the steady flame that burns bright in a windless place, may your inner light remain constant. Until we meet again on this sacred path. Om Shanti Shanti Shanti. 🕉️"
        
        # Default response
        return "🙏 Beloved seeker, I am here as your eternal companion, just as I was for Arjuna in his moment of need. Whether your heart carries joy like the morning sun or sorrow like the evening clouds, share what stirs within you. Together, we shall find the perfect verses from our sacred Gita to illuminate your path forward."


# Singleton instance
_casual_chat_service = None


def get_casual_chat_service() -> CasualChatService:
    """Get or create singleton casual chat service instance."""
    global _casual_chat_service
    if _casual_chat_service is None:
        _casual_chat_service = CasualChatService()
    return _casual_chat_service
