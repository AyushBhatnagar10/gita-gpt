from fastapi import APIRouter, HTTPException, Depends
from app.schemas.verse import VerseSearchRequest, VerseSearchResponse, VerseSearchResult, VerseMetadataResponse
from app.services.vector_search import VectorSearchService
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
    """
    try:
        verse_data = vector_service.get_verse_by_id(verse_id)
        
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


@router.get("/health")
async def verse_service_health(
    vector_service: VectorSearchService = Depends(get_vector_service)
) -> dict:
    """
    Health check endpoint for the verse search service.
    
    Returns the status of the vector database and search service.
    """
    try:
        # Test search with a simple query
        test_results = vector_service.search_verses("dharma", top_k=1)
        
        # Check collection count
        collection_count = vector_service.collection.count()
        
        return {
            "status": "healthy",
            "vector_db": "ChromaDB",
            "embedding_model": "all-mpnet-base-v2",
            "verses_count": collection_count,
            "test_search": len(test_results) > 0,
            "message": "Verse search service is operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Verse search service is not operational"
        }