from fastapi import APIRouter, HTTPException, Depends
from app.schemas.verse import VerseSearchRequest, VerseSearchResponse, VerseSearchResult, VerseMetadataResponse
from app.services.vector_search import VectorSearchService
from app.services.supabase_service import get_supabase_service, SupabaseService
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/verses", tags=["verses"])

# Global service instance (will be initialized on first use)
_vector_service: Optional[VectorSearchService] = None


def get_vector_service() -> VectorSearchService:
    """
    Dependency to get or create VectorSearchService instance.
    """
    global _vector_service
    if _vector_service is None:
        try:
            _vector_service = VectorSearchService()
            # Initialize database if CSV file exists
            try:
                _vector_service.initialize_database("Bhagwad_Gita.csv")
            except Exception as e:
                logger.warning(f"Could not initialize database from CSV: {e}")
        except Exception as e:
            logger.error(f"Failed to initialize VectorSearchService: {e}")
            raise HTTPException(status_code=500, detail="Vector search service unavailable")
    
    return _vector_service


@router.post("/search", response_model=VerseSearchResponse)
async def search_verses(
    request: VerseSearchRequest,
    vector_service: VectorSearchService = Depends(get_vector_service)
) -> VerseSearchResponse:
    """
    Search for relevant Bhagavad Gita verses based on semantic similarity.
    
    This endpoint performs semantic search using SentenceTransformers embeddings
    and optionally re-ranks results based on emotion-theme alignment.
    
    - **query**: Text to search for (1-5000 characters)
    - **emotion**: Optional emotion for theme-based re-ranking
    - **top_k**: Number of verses to return (1-20, default: 5)
    
    Returns verses sorted by relevance score (semantic similarity + optional theme alignment).
    Each verse includes Sanskrit text, transliteration, English meaning, and similarity score.
    
    The service uses ChromaDB for vector storage and 'all-mpnet-base-v2' model for embeddings.
    """
    try:
        # Search for verses using the vector service
        verses_data = vector_service.search_verses(
            query=request.query,
            emotion=request.emotion,
            top_k=request.top_k
        )
        
        # Convert to Pydantic models
        verses = [VerseSearchResult(**verse) for verse in verses_data]
        
        return VerseSearchResponse(
            verses=verses,
            query=request.query,
            emotion=request.emotion
        )
        
    except Exception as e:
        logger.error(f"Error in verse search endpoint: {e}")
        
        # Handle ChromaDB connection errors with fallback
        # Return empty results with error message
        raise HTTPException(
            status_code=500,
            detail="Unable to search verses. Please try again later."
        )


@router.get("/random", response_model=VerseMetadataResponse)
async def get_random_verse(
    vector_service: VectorSearchService = Depends(get_vector_service)
) -> VerseMetadataResponse:
    """
    Get a random verse from the Bhagavad Gita.
    
    Returns a randomly selected verse with complete metadata including
    Sanskrit text, transliteration, English meaning, and chapter/verse numbers.
    Uses ChromaDB as primary source with Supabase as future enhancement.
    """
    try:
        # Try Supabase first if configured
        try:
            from app.services.supabase_service import get_supabase_service
            supabase_service = get_supabase_service()
            verse_data = supabase_service.get_random_verse()
            if verse_data:
                return VerseMetadataResponse(**verse_data)
        except Exception as supabase_error:
            logger.warning(f"Supabase unavailable, falling back to ChromaDB: {supabase_error}")
        
        # Fallback to ChromaDB
        verse_data = vector_service.get_random_verse()
        
        if verse_data is None:
            raise HTTPException(
                status_code=404,
                detail="No verses available"
            )
        
        return VerseMetadataResponse(**verse_data)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error retrieving random verse: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve random verse. Please try again later."
        )


@router.get("/health")
async def verse_service_health(
    vector_service: VectorSearchService = Depends(get_vector_service)
) -> dict:
    """
    Health check endpoint for the verse services.
    
    Returns the status of both ChromaDB (vector search) and Supabase (verse storage).
    """
    try:
        # Test ChromaDB
        chroma_healthy = True
        chroma_count = 0
        try:
            test_results = vector_service.search_verses("dharma", top_k=1)
            chroma_count = vector_service.collection.count()
        except Exception as e:
            chroma_healthy = False
            logger.warning(f"ChromaDB health check failed: {e}")
        
        # Test Supabase
        supabase_healthy = False
        supabase_count = 0
        try:
            from app.services.supabase_service import get_supabase_service
            supabase_service = get_supabase_service()
            supabase_count = supabase_service.get_verse_count()
            supabase_healthy = True
        except Exception as e:
            logger.warning(f"Supabase health check failed: {e}")
        
        overall_status = "healthy" if (chroma_healthy or supabase_healthy) else "unhealthy"
        
        return {
            "status": overall_status,
            "services": {
                "chromadb": {
                    "status": "healthy" if chroma_healthy else "unhealthy",
                    "verses_count": chroma_count,
                    "purpose": "Semantic search"
                },
                "supabase": {
                    "status": "healthy" if supabase_healthy else "unhealthy",
                    "verses_count": supabase_count,
                    "purpose": "Verse storage and random access"
                }
            },
            "message": f"Verse services are {'operational' if overall_status == 'healthy' else 'experiencing issues'}"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Verse services are not operational"
        }


@router.get("/{verse_id}", response_model=VerseMetadataResponse)
async def get_verse_by_id(
    verse_id: str,
    vector_service: VectorSearchService = Depends(get_vector_service)
) -> VerseMetadataResponse:
    """
    Retrieve a specific verse by its ID.
    
    - **verse_id**: Unique verse identifier (e.g., "BG2.47")
    
    Returns the complete verse data including Sanskrit text, transliteration,
    English and Hindi meanings, and word-by-word meaning.
    Tries ChromaDB first, then falls back to Supabase.
    """
    try:
        # Try ChromaDB first (for consistency with search)
        verse_data = vector_service.get_verse_by_id(verse_id)
        
        # If not found in ChromaDB, try Supabase as fallback
        if verse_data is None:
            try:
                from app.services.supabase_service import get_supabase_service
                supabase_service = get_supabase_service()
                verse_data = supabase_service.get_verse_by_id(verse_id)
            except Exception as supabase_error:
                logger.warning(f"Supabase fallback failed: {supabase_error}")
        
        if verse_data is None:
            raise HTTPException(
                status_code=404,
                detail=f"Verse with ID '{verse_id}' not found"
            )
        
        return VerseMetadataResponse(**verse_data)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error retrieving verse {verse_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve verse. Please try again later."
        )


@router.get("/chapter/{chapter_num}")
async def get_verses_by_chapter(
    chapter_num: int
) -> dict:
    """
    Get all verses from a specific chapter.
    
    - **chapter_num**: Chapter number (1-18)
    
    Returns all verses from the specified chapter with complete metadata.
    """
    try:
        if chapter_num < 1 or chapter_num > 18:
            raise HTTPException(
                status_code=400,
                detail="Chapter number must be between 1 and 18"
            )
        
        # Try Supabase for chapter verses
        try:
            from app.services.supabase_service import get_supabase_service
            supabase_service = get_supabase_service()
            verses_data = supabase_service.get_verses_by_chapter(chapter_num)
        except Exception as supabase_error:
            logger.warning(f"Supabase unavailable for chapter query: {supabase_error}")
            raise HTTPException(
                status_code=503,
                detail="Chapter verse lookup temporarily unavailable. Please configure Supabase."
            )
        
        verses = [VerseMetadataResponse(**verse) for verse in verses_data]
        
        return {
            "chapter": chapter_num,
            "verse_count": len(verses),
            "verses": verses
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error retrieving verses for chapter {chapter_num}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve chapter verses. Please try again later."
        )
