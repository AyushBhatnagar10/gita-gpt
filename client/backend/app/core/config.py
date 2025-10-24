from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GeetaManthan+"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/geetamanthan")
    
    # AI/ML Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    HUGGINGFACE_TOKEN: str = os.getenv("HUGGINGFACE_TOKEN", "")
    
    # ChromaDB
    CHROMA_DB_PATH: str = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    
    # Model Settings
    EMOTION_MODEL: str = "SamLowe/roberta-base-go_emotions-onnx"
    EMOTION_MODEL_FILE: str = "onnx/model_quantized.onnx"
    EMBEDDING_MODEL: str = "all-mpnet-base-v2"
    LLM_MODEL: str = "gemini-pro"
    
    # Conversation Settings
    CONVERSATION_MEMORY_WINDOW: int = 5
    EMOTION_CONFIDENCE_THRESHOLD: float = 0.3
    
    class Config:
        case_sensitive = True

settings = Settings()
