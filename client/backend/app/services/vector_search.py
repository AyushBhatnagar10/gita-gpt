from sentence_transformers import SentenceTransformer
import chromadb
from typing import List, Dict, Optional
import pandas as pd
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class VectorSearchService:
    """
    Service for semantic verse search using ChromaDB and SentenceTransformers.
    Handles initialization, verse search, and emotion-based re-ranking.
    """
    
    # Emotion-theme mapping for verse re-ranking
    EMOTION_THEME_MAP = {
        # Anxiety and worry
        "nervousness": ["surrender", "faith", "detachment"],
        "fear": ["courage", "protection", "divine_support"],
        
        # Confusion and doubt
        "confusion": ["clarity", "wisdom", "guidance"],
        "curiosity": ["knowledge", "learning", "understanding"],
        
        # Anger and frustration
        "anger": ["equanimity", "self-control", "forgiveness"],
        "annoyance": ["patience", "tolerance", "peace"],
        "disapproval": ["acceptance", "understanding", "compassion"],
        "disgust": ["purity", "detachment", "equanimity"],
        
        # Sadness and grief
        "sadness": ["hope", "resilience", "purpose"],
        "grief": ["acceptance", "impermanence", "strength"],
        "disappointment": ["detachment", "perseverance", "faith"],
        "remorse": ["forgiveness", "learning", "growth"],
        "embarrassment": ["self-acceptance", "humility", "growth"],
        
        # Joy and positive emotions
        "joy": ["gratitude", "devotion", "celebration"],
        "gratitude": ["devotion", "humility", "appreciation"],
        "love": ["devotion", "compassion", "unity"],
        "admiration": ["respect", "learning", "inspiration"],
        "pride": ["humility", "service", "dharma"],
        "excitement": ["enthusiasm", "action", "purpose"],
        "amusement": ["joy", "lightness", "balance"],
        "relief": ["peace", "surrender", "trust"],
        "optimism": ["hope", "faith", "perseverance"],
        "caring": ["compassion", "service", "love"],
        "approval": ["acceptance", "harmony", "peace"],
        
        # Ambiguous emotions
        "desire": ["detachment", "contentment", "wisdom"],
        "realization": ["knowledge", "awakening", "truth"],
        "surprise": ["acceptance", "adaptability", "learning"],
    }
    
    def __init__(self, db_path: str = "./chroma_db"):
        """
        Initialize the VectorSearchService with SentenceTransformer model and ChromaDB client.
        
        Args:
            db_path: Path to ChromaDB persistent storage
        """
        try:
            # Initialize SentenceTransformer model for embeddings
            self.encoder = SentenceTransformer('all-mpnet-base-v2')
            logger.info("SentenceTransformer model loaded successfully")
            
            # Initialize ChromaDB persistent client
            self.client = chromadb.PersistentClient(path=db_path)
            
            # Get or create collection for Geeta verses
            self.collection = self.client.get_or_create_collection(
                name="geeta_verses",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info(f"ChromaDB collection initialized at {db_path}")
            
        except Exception as e:
            logger.error(f"Failed to initialize VectorSearchService: {e}")
            raise
    
    def initialize_database(self, csv_path: str) -> bool:
        """
        Load verses from CSV file and create embeddings in ChromaDB.
        
        Args:
            csv_path: Path to the Bhagavad Gita CSV file
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Check if collection already has data
            if self.collection.count() > 0:
                logger.info(f"Collection already contains {self.collection.count()} verses")
                return True
            
            # Read CSV file
            df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(df)} verses from {csv_path}")
            
            # Prepare data for ChromaDB
            documents = []
            metadatas = []
            ids = []
            
            for _, row in df.iterrows():
                # Concatenate Shloka and EngMeaning for embedding
                document = f"{row['Shloka']} {row['EngMeaning']}"
                documents.append(document)
                
                # Prepare metadata (ChromaDB only accepts str, int, float, bool)
                metadata = {
                    "id": row['ID'],
                    "chapter": int(row['Chapter']),
                    "verse": int(row['Verse']),
                    "shloka": row['Shloka'],
                    "transliteration": row.get('Transliteration', ''),
                    "eng_meaning": row['EngMeaning'],
                    "hin_meaning": row.get('HinMeaning', ''),
                    "word_meaning": row.get('WordMeaning', ''),
                    # Note: themes removed as ChromaDB doesn't support list metadata
                }
                metadatas.append(metadata)
                ids.append(row['ID'])
            
            # Generate embeddings and add to collection
            logger.info("Generating embeddings...")
            embeddings = self.encoder.encode(documents, show_progress_bar=True)
            
            # Add to ChromaDB collection
            self.collection.add(
                documents=documents,
                embeddings=embeddings.tolist(),
                metadatas=metadatas,
                ids=ids
            )
            
            logger.info(f"Successfully added {len(documents)} verses to ChromaDB")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            return False
    
    def search_verses(
        self,
        query: str,
        emotion: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict]:
        """
        Search for relevant verses based on semantic similarity.
        Optionally re-rank based on emotion-theme mapping.
        
        Args:
            query: User input text to search for
            emotion: Detected emotion for re-ranking (optional)
            top_k: Number of verses to return
            
        Returns:
            List of verse dictionaries with similarity scores
        """
        try:
            # Generate query embedding
            query_embedding = self.encoder.encode([query])
            
            # Search in ChromaDB
            results = self.collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=top_k * 2 if emotion else top_k,  # Get more results if we'll re-rank
                include=["metadatas", "distances"]
            )
            
            # Convert results to list of dictionaries
            verses = []
            for i in range(len(results['ids'][0])):
                metadata = results['metadatas'][0][i]
                distance = results['distances'][0][i]
                similarity_score = 1 - distance  # Convert distance to similarity
                
                verse = {
                    "id": metadata["id"],
                    "chapter": metadata["chapter"],
                    "verse": metadata["verse"],
                    "shloka": metadata["shloka"],
                    "transliteration": metadata.get("transliteration", ""),
                    "eng_meaning": metadata["eng_meaning"],
                    "hin_meaning": metadata.get("hin_meaning", ""),
                    "word_meaning": metadata.get("word_meaning", ""),
                    "similarity_score": similarity_score
                }
                verses.append(verse)
            
            # Apply emotion-based re-ranking if emotion is provided
            if emotion:
                verses = self._rerank_by_emotion(verses, emotion)
            
            # Return top_k results
            return verses[:top_k]
            
        except Exception as e:
            logger.error(f"Failed to search verses: {e}")
            return []
    
    def get_verse_by_id(self, verse_id: str) -> Optional[Dict]:
        """
        Retrieve specific verse by ID.
        
        Args:
            verse_id: Unique verse identifier (e.g., "BG2.47")
            
        Returns:
            Verse dictionary or None if not found
        """
        try:
            results = self.collection.get(
                ids=[verse_id],
                include=["metadatas"]
            )
            
            if results['ids'] and len(results['ids']) > 0:
                metadata = results['metadatas'][0]
                return {
                    "id": metadata["id"],
                    "chapter": metadata["chapter"],
                    "verse": metadata["verse"],
                    "shloka": metadata["shloka"],
                    "transliteration": metadata.get("transliteration", ""),
                    "eng_meaning": metadata["eng_meaning"],
                    "hin_meaning": metadata.get("hin_meaning", ""),
                    "word_meaning": metadata.get("word_meaning", "")
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get verse by ID {verse_id}: {e}")
            return None
    
    def _rerank_by_emotion(self, verses: List[Dict], emotion: str) -> List[Dict]:
        """
        Re-rank verses based on emotion-theme alignment.
        
        Note: Currently simplified to just return verses by similarity score
        since theme metadata is not stored in ChromaDB (doesn't support list types).
        Future enhancement: Store themes in a separate mapping or use string encoding.
        
        Args:
            verses: List of verse dictionaries
            emotion: Detected emotion
            
        Returns:
            Re-ranked list of verses (currently just sorted by similarity)
        """
        # For now, just return verses sorted by similarity score
        # Theme-based re-ranking can be added later with a separate theme mapping
        return sorted(verses, key=lambda x: x.get("similarity_score", 0), reverse=True)