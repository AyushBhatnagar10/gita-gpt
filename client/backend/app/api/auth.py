"""
Authentication endpoints for user management.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.db.database import get_db
from app.core.auth import require_auth, optional_auth
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/auth", tags=["authentication"])


class UserProfileResponse(BaseModel):
    """Response model for user profile."""
    id: str
    firebase_uid: str
    email: Optional[str]
    display_name: Optional[str]
    created_at: datetime
    last_active: Optional[datetime]
    preferences: dict
    
    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    """Request model for updating user profile."""
    display_name: Optional[str] = Field(None, max_length=255)
    preferences: Optional[dict] = Field(None)


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: User = Depends(require_auth)
) -> UserProfileResponse:
    """
    Get current authenticated user's profile.
    
    Returns the complete user profile including preferences and activity data.
    This endpoint requires authentication via Firebase JWT token.
    
    Returns:
    - User profile with ID, email, display name, preferences, and timestamps
    """
    return UserProfileResponse(
        id=str(current_user.id),
        firebase_uid=current_user.firebase_uid,
        email=current_user.email,
        display_name=current_user.display_name,
        created_at=current_user.created_at,
        last_active=current_user.last_active,
        preferences=current_user.preferences or {}
    )


@router.put("/me", response_model=UserProfileResponse)
async def update_user_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db)
) -> UserProfileResponse:
    """
    Update current user's profile information.
    
    Allows updating display name and user preferences.
    Email cannot be updated through this endpoint (managed by Firebase).
    
    - **display_name**: New display name (optional)
    - **preferences**: User preferences dictionary (optional)
    
    Returns the updated user profile.
    """
    try:
        # Update fields if provided
        if request.display_name is not None:
            current_user.display_name = request.display_name
        
        if request.preferences is not None:
            # Merge with existing preferences
            existing_prefs = current_user.preferences or {}
            existing_prefs.update(request.preferences)
            current_user.preferences = existing_prefs
        
        # Update last active timestamp
        current_user.last_active = datetime.utcnow()
        
        db.commit()
        db.refresh(current_user)
        
        return UserProfileResponse(
            id=str(current_user.id),
            firebase_uid=current_user.firebase_uid,
            email=current_user.email,
            display_name=current_user.display_name,
            created_at=current_user.created_at,
            last_active=current_user.last_active,
            preferences=current_user.preferences or {}
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.delete("/me")
async def delete_user_account(
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db)
) -> dict:
    """
    Delete current user's account and all associated data.
    
    This endpoint permanently deletes:
    - User profile
    - All conversation sessions and messages
    - All emotion logs and mood tracking data
    - All analytics data
    
    This action cannot be undone.
    
    Returns confirmation of deletion.
    """
    try:
        # Delete user (cascade will handle related data)
        db.delete(current_user)
        db.commit()
        
        return {
            "message": "Account successfully deleted",
            "user_id": str(current_user.id),
            "deleted_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )


@router.get("/status")
async def get_auth_status(
    current_user: Optional[User] = Depends(optional_auth)
) -> dict:
    """
    Check authentication status.
    
    This endpoint can be called with or without authentication to check
    the current authentication state.
    
    Returns:
    - authenticated: Boolean indicating if user is authenticated
    - user_id: User ID if authenticated, null otherwise
    - firebase_uid: Firebase UID if authenticated, null otherwise
    """
    if current_user:
        return {
            "authenticated": True,
            "user_id": str(current_user.id),
            "firebase_uid": current_user.firebase_uid,
            "email": current_user.email,
            "display_name": current_user.display_name
        }
    else:
        return {
            "authenticated": False,
            "user_id": None,
            "firebase_uid": None,
            "email": None,
            "display_name": None
        }


@router.get("/health")
async def auth_service_health() -> dict:
    """
    Health check endpoint for the authentication service.
    
    Returns the status of Firebase authentication service.
    """
    try:
        from app.core.firebase import firebase_service
        
        if firebase_service.is_initialized():
            return {
                "status": "healthy",
                "firebase_initialized": True,
                "message": "Authentication service is operational"
            }
        else:
            return {
                "status": "degraded",
                "firebase_initialized": False,
                "message": "Firebase not initialized, authentication unavailable"
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Authentication service is not operational"
        }