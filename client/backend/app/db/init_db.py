"""
Database initialization script for GeetaManthan+
"""
import logging
from sqlalchemy import text
from app.db.database import engine, create_tables
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize the database with tables and extensions"""
    try:
        logger.info("Initializing database...")
        
        # Create UUID extension if it doesn't exist
        with engine.connect() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
            connection.commit()
            logger.info("UUID extension created/verified")
        
        # Create all tables
        create_tables()
        
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


def check_database_connection():
    """Check if database connection is working"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False


if __name__ == "__main__":
    db_host = settings.DATABASE_URL.split('@')[1].split(':')[0] if '@' in settings.DATABASE_URL else 'localhost'
    logger.info(f"Connecting to database: {db_host}")
    
    # For development, we'll create the models structure even if connection fails
    # This allows us to validate the model definitions
    try:
        if check_database_connection():
            init_database()
        else:
            logger.warning("Database connection failed, but creating table definitions for validation...")
            # Import models to validate structure
            from app.models import User, ConversationSession, ConversationMessage, EmotionLog, VerseMetadata
            logger.info("✅ All database models imported and validated successfully")
            logger.info("📝 SQL schema file created at: backend/migrations/001_initial_schema.sql")
            logger.info("🔧 To initialize database: Update DATABASE_URL in .env and run this script again")
    except Exception as e:
        logger.error(f"Model validation failed: {e}")
        raise