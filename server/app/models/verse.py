from sqlalchemy import Column, String, Integer, Text
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.database import Base


class VerseMetadata(Base):
    __tablename__ = "verse_metadata"

    id = Column(String(20), primary_key=True)
    chapter = Column(Integer, nullable=False)
    verse = Column(Integer, nullable=False)
    shloka = Column(Text, nullable=False)
    transliteration = Column(Text)
    eng_meaning = Column(Text, nullable=False)
    hin_meaning = Column(Text)
    word_meaning = Column(Text)
    themes = Column(ARRAY(String))  # Extracted themes for emotion mapping

    def __repr__(self):
        return f"<VerseMetadata(id={self.id}, chapter={self.chapter}, verse={self.verse})>"