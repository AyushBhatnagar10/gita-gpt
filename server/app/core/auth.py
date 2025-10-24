"""
Authentication middleware and utilities for Firebase JWT token verification.
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.firebase import firebase_service
from app.db.database import get_db
from app.models.user import User


# Security scheme for Bearer token
security = HTTPBearer()


class AuthenticationError(HTTPException):
    """Custom authentication error."""
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Firebase ID token and return decoded token.
    
    Args:
        credentials: HTTP Bearer token credentials
        
    Returns:
        Decoded Firebase token
        
    Raises:
        AuthenticationError: If token is invalid or verification fails
    """
    if not firebase_service.is_initialized():
        raise AuthenticationError("Authentication service unavailable")
    
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Verify token with Firebase
        decoded_token = firebase_service.verify_token(token)
        
        if not decoded_token:
            raise AuthenticationError("Invalid or expired token")
        
        return decoded_token
    
    except Exception as e:
        raise AuthenticationError(f"Token verification failed: {str(e)}")


async def get_current_user(
    token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from database.
    Creates user if doesn't exist (first login).
    
    Args:
        token: Decoded Firebase token
        db: Database session
        
    Returns:
        User model instance
        
    Raises:
        AuthenticationError: If user creation/retrieval fails
    """
    try:
        firebase_uid = token.get("uid")
        email = token.get("email")
        display_name = token.get("name")
        
        if not firebase_uid:
            raise AuthenticationError("Invalid token: missing user ID")
        
        # Try to get existing user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            # Create new user on first login
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name,
                last_active=datetime.utcnow(),
                preferences={}
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created new user: {firebase_uid} ({email})")
        else:
            # Update last active timestamp
            user.last_active = datetime.utcnow()
            db.commit()
        
        return user
    
    except Exception as e:
        db.rollback()
        raise AuthenticationError(f"User authentication failed: {str(e)}")


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None.
    Useful for endpoints that work with or without authentication.
    
    Args:
        credentials: Optional HTTP Bearer token credentials
        db: Database session
        
    Returns:
        User model instance if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        # Verify token
        token = firebase_service.verify_token(credentials.credentials)
        if not token:
            return None
        
        firebase_uid = token.get("uid")
        if not firebase_uid:
            return None
        
        # Get user from database
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if user:
            # Update last active timestamp
            user.last_active = datetime.utcnow()
            db.commit()
        
        return user
    
    except Exception:
        return None


def require_auth(user: User = Depends(get_current_user)) -> User:
    """
    Dependency that requires authentication.
    Use this for protected endpoints.
    
    Args:
        user: Current authenticated user
        
    Returns:
        User model instance
    """
    return user


def optional_auth(user: Optional[User] = Depends(get_optional_user)) -> Optional[User]:
    """
    Dependency for optional authentication.
    Use this for endpoints that work with or without auth.
    
    Args:
        user: Current user if authenticated, None otherwise
        
    Returns:
        User model instance or None
    """
    return user


# Utility functions for checking user permissions
def check_user_access(current_user: User, target_user_id: str) -> bool:
    """
    Check if current user has access to target user's data.
    
    Args:
        current_user: Current authenticated user
        target_user_id: Target user ID to check access for
        
    Returns:
        True if access is allowed, False otherwise
    """
    # Users can only access their own data
    return str(current_user.id) == target_user_id


def get_user_id_from_token(token: dict) -> str:
    """
    Extract user ID from Firebase token.
    
    Args:
        token: Decoded Firebase token
        
    Returns:
        Firebase UID
        
    Raises:
        AuthenticationError: If UID is missing from token
    """
    uid = token.get("uid")
    if not uid:
        raise AuthenticationError("Invalid token: missing user ID")
    return uid