from pydantic import BaseModel, Field
from typing import Optional, List


class VerseMetadataBase(BaseModel):
    id: str
    chapter: int
    verse: int
    shloka: str
    transliteration: Optional[str] = None
    eng_meaning: str
    hin_meaning: Optional[str] = None
    word_meaning: Optional[str] = None
    themes: Optional[List[str]] = None


class VerseMetadataResponse(VerseMetadataBase):
    class Config:
        from_attributes = True


class VerseSearchResult(VerseMetadataBase):
    similarity_score: Optional[float] = None


class VerseSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=5000, description="Text to search for relevant verses")
    emotion: Optional[str] = Field(None, description="Detected emotion for re-ranking")
    top_k: int = Field(5, ge=1, le=20, description="Number of verses to return")


class VerseSearchResponse(BaseModel):
    verses: List[VerseSearchResult]
    query: str
    emotion: Optional[str] = None