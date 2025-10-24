from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
import uuid


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = {}


class UserCreate(UserBase):
    firebase_uid: str


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    id: uuid.UUID
    firebase_uid: str
    created_at: datetime
    last_active: Optional[datetime] = None

    class Config:
        from_attributes = True