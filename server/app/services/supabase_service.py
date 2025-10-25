from supabase import create_client, Client
from typing import Dict, List, Optional
import logging
import random
from app.core.config import settings

logger = logging.getLogger(__name__)


class SupabaseService:
    """
    Service for interacting with Supabase database.
    Handles verse operations like fetching random verses, searching, etc.
    """
    
    def __init__(self):
        """Initialize Supabase client."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
        
        try:
            self.client: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    def get_random_verse(self) -> Optional[Dict]:
        """
        Get a random verse from the Bhagavad Gita.
        
        Returns:
            Random verse dictionary or None if error
        """
        try:
            # Get total count first
            count_response = self.client.table('verse_metadata').select('id', count='exact').execute()
            total_count = count_response.count
            
            if total_count == 0:
                logger.warning("No verses found in database")
                return None
            
            # Generate random offset
            random_offset = random.randint(0, total_count - 1)
            
            # Fetch random verse using offset
            response = self.client.table('verse_metadata').select('*').range(random_offset, random_offset).execute()
            
            if response.data and len(response.data) > 0:
                verse_data = response.data[0]
                
                # Convert to expected format
                return {
                    "id": verse_data.get("id"),
                    "chapter": verse_data.get("chapter"),
                    "verse": verse_data.get("verse"),
                    "shloka": verse_data.get("shloka"),
                    "transliteration": verse_data.get("transliteration"),
                    "eng_meaning": verse_data.get("eng_meaning"),
                    "hin_meaning": verse_data.get("hin_meaning"),
                    "word_meaning": verse_data.get("word_meaning"),
                    "themes": verse_data.get("themes", [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get random verse from Supabase: {e}")
            return None
    
    def get_verse_by_id(self, verse_id: str) -> Optional[Dict]:
        """
        Get a specific verse by ID.
        
        Args:
            verse_id: Unique verse identifier (e.g., "BG2.47")
            
        Returns:
            Verse dictionary or None if not found
        """
        try:
            response = self.client.table('verse_metadata').select('*').eq('id', verse_id).execute()
            
            if response.data and len(response.data) > 0:
                verse_data = response.data[0]
                
                return {
                    "id": verse_data.get("id"),
                    "chapter": verse_data.get("chapter"),
                    "verse": verse_data.get("verse"),
                    "shloka": verse_data.get("shloka"),
                    "transliteration": verse_data.get("transliteration"),
                    "eng_meaning": verse_data.get("eng_meaning"),
                    "hin_meaning": verse_data.get("hin_meaning"),
                    "word_meaning": verse_data.get("word_meaning"),
                    "themes": verse_data.get("themes", [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get verse {verse_id} from Supabase: {e}")
            return None
    
    def get_verses_by_chapter(self, chapter: int) -> List[Dict]:
        """
        Get all verses from a specific chapter.
        
        Args:
            chapter: Chapter number (1-18)
            
        Returns:
            List of verse dictionaries
        """
        try:
            response = self.client.table('verse_metadata').select('*').eq('chapter', chapter).order('verse').execute()
            
            verses = []
            for verse_data in response.data:
                verses.append({
                    "id": verse_data.get("id"),
                    "chapter": verse_data.get("chapter"),
                    "verse": verse_data.get("verse"),
                    "shloka": verse_data.get("shloka"),
                    "transliteration": verse_data.get("transliteration"),
                    "eng_meaning": verse_data.get("eng_meaning"),
                    "hin_meaning": verse_data.get("hin_meaning"),
                    "word_meaning": verse_data.get("word_meaning"),
                    "themes": verse_data.get("themes", [])
                })
            
            return verses
            
        except Exception as e:
            logger.error(f"Failed to get verses for chapter {chapter} from Supabase: {e}")
            return []
    
    def search_verses_by_text(self, query: str, limit: int = 10) -> List[Dict]:
        """
        Search verses by text content (basic text search).
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of matching verse dictionaries
        """
        try:
            # Use ilike for case-insensitive search in both Sanskrit and English
            response = self.client.table('verse_metadata').select('*').or_(
                f'shloka.ilike.%{query}%,eng_meaning.ilike.%{query}%'
            ).limit(limit).execute()
            
            verses = []
            for verse_data in response.data:
                verses.append({
                    "id": verse_data.get("id"),
                    "chapter": verse_data.get("chapter"),
                    "verse": verse_data.get("verse"),
                    "shloka": verse_data.get("shloka"),
                    "transliteration": verse_data.get("transliteration"),
                    "eng_meaning": verse_data.get("eng_meaning"),
                    "hin_meaning": verse_data.get("hin_meaning"),
                    "word_meaning": verse_data.get("word_meaning"),
                    "themes": verse_data.get("themes", [])
                })
            
            return verses
            
        except Exception as e:
            logger.error(f"Failed to search verses in Supabase: {e}")
            return []
    
    def get_verse_count(self) -> int:
        """
        Get total number of verses in the database.
        
        Returns:
            Total verse count
        """
        try:
            response = self.client.table('verse_metadata').select('id', count='exact').execute()
            return response.count or 0
        except Exception as e:
            logger.error(f"Failed to get verse count from Supabase: {e}")
            return 0


# Singleton instance
_supabase_service: Optional[SupabaseService] = None


def get_supabase_service() -> SupabaseService:
    """Get or create singleton Supabase service instance."""
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service