#!/usr/bin/env python3
"""
Script to initialize ChromaDB with Bhagavad Gita verses.
Run this once to populate the vector database.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_search import VectorSearchService
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Initialize ChromaDB with verses from CSV."""
    try:
        # Initialize vector search service
        logger.info("Initializing VectorSearchService...")
        vector_service = VectorSearchService(db_path="./chroma_db")
        
        # Initialize database with CSV file
        csv_path = "../Bhagwad_Gita.csv"
        logger.info(f"Loading verses from {csv_path}...")
        
        success = vector_service.initialize_database(csv_path)
        
        if success:
            count = vector_service.collection.count()
            logger.info(f"✅ Successfully initialized ChromaDB with {count} verses!")
            
            # Test search
            logger.info("Testing search functionality...")
            test_results = vector_service.search_verses("dharma duty", top_k=3)
            logger.info(f"Test search returned {len(test_results)} results")
            
            if test_results:
                logger.info(f"Sample result: {test_results[0]['id']} - {test_results[0]['eng_meaning'][:100]}...")
            
        else:
            logger.error("❌ Failed to initialize ChromaDB")
            return 1
            
    except Exception as e:
        logger.error(f"❌ Error initializing ChromaDB: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())