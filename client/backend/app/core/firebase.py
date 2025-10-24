"""
Firebase Admin SDK configuration and initialization.
"""
import firebase_admin
from firebase_admin import credentials, auth
from typing import Optional
import os
import json
from .config import settings

class FirebaseService:
    """Firebase Admin SDK service for authentication."""
    
    def __init__(self):
        self._app: Optional[firebase_admin.App] = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK."""
        try:
            # Check if Firebase is already initialized
            if firebase_admin._apps:
                self._app = firebase_admin.get_app()
                return
            
            # Initialize from service account file
            if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                self._app = firebase_admin.initialize_app(cred)
                print("Firebase initialized with service account credentials")
            else:
                # Try to initialize with default credentials (for production)
                try:
                    cred = credentials.ApplicationDefault()
                    self._app = firebase_admin.initialize_app(cred)
                    print("Firebase initialized with default credentials")
                except Exception as e:
                    print(f"Warning: Firebase not initialized - {e}")
                    self._app = None
        
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            self._app = None
    
    def verify_token(self, id_token: str) -> Optional[dict]:
        """
        Verify Firebase ID token and return decoded token.
        
        Args:
            id_token: Firebase ID token from client
            
        Returns:
            Decoded token dict if valid, None if invalid
        """
        if not self._app:
            raise Exception("Firebase not initialized")
        
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None
    
    def get_user(self, uid: str) -> Optional[dict]:
        """
        Get user information by UID.
        
        Args:
            uid: Firebase user UID
            
        Returns:
            User record dict if found, None if not found
        """
        if not self._app:
            raise Exception("Firebase not initialized")
        
        try:
            user_record = auth.get_user(uid)
            return {
                "uid": user_record.uid,
                "email": user_record.email,
                "display_name": user_record.display_name,
                "email_verified": user_record.email_verified,
                "disabled": user_record.disabled,
                "provider_data": [
                    {
                        "provider_id": provider.provider_id,
                        "uid": provider.uid,
                        "email": provider.email,
                        "display_name": provider.display_name
                    }
                    for provider in user_record.provider_data
                ]
            }
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def is_initialized(self) -> bool:
        """Check if Firebase is properly initialized."""
        return self._app is not None

# Global Firebase service instance
firebase_service = FirebaseService()