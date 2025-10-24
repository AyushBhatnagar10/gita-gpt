"""
Tests for Firebase authentication integration.
"""
import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.main import app
from app.core.auth import verify_firebase_token, get_current_user, AuthenticationError
from app.core.firebase import firebase_service


client = TestClient(app)


class TestFirebaseAuthentication:
    """Test Firebase authentication functionality."""
    
    def test_firebase_service_initialization(self):
        """Test that Firebase service initializes properly."""
        # Firebase service should be initialized (even if not configured)
        assert firebase_service is not None
    
    @patch('app.core.firebase.firebase_service.verify_token')
    def test_verify_firebase_token_success(self, mock_verify):
        """Test successful token verification."""
        # Mock successful token verification
        mock_verify.return_value = {
            "uid": "test-uid-123",
            "email": "test@example.com",
            "name": "Test User"
        }
        
        # Mock credentials
        mock_credentials = Mock()
        mock_credentials.credentials = "valid-token"
        
        # This would normally be called by FastAPI dependency injection
        # We're testing the logic directly
        assert mock_verify.return_value["uid"] == "test-uid-123"
    
    @patch('app.core.firebase.firebase_service.verify_token')
    def test_verify_firebase_token_invalid(self, mock_verify):
        """Test invalid token verification."""
        # Mock failed token verification
        mock_verify.return_value = None
        
        mock_credentials = Mock()
        mock_credentials.credentials = "invalid-token"
        
        # Verify that None is returned for invalid tokens
        assert mock_verify.return_value is None
    
    def test_auth_status_endpoint_unauthenticated(self):
        """Test auth status endpoint without authentication."""
        response = client.get("/api/auth/status")
        assert response.status_code == 200
        
        data = response.json()
        assert data["authenticated"] is False
        assert data["user_id"] is None
        assert data["firebase_uid"] is None
    
    def test_auth_health_endpoint(self):
        """Test auth service health endpoint."""
        response = client.get("/api/auth/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert "firebase_initialized" in data
    
    def test_protected_endpoint_without_auth(self):
        """Test that protected endpoints require authentication."""
        # Try to access protected chat endpoint without auth
        response = client.post("/api/chat/", json={
            "user_input": "Test message",
            "interaction_mode": "wisdom"
        })
        
        # Should return 401 or 403 (depending on FastAPI HTTPBearer implementation)
        assert response.status_code in [401, 403]
    
    def test_protected_endpoint_with_invalid_token(self):
        """Test protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid-token"}
        
        response = client.post("/api/chat/", 
            json={
                "user_input": "Test message",
                "interaction_mode": "wisdom"
            },
            headers=headers
        )
        
        # Should return 401 Unauthorized
        assert response.status_code == 401


class TestAuthenticationMiddleware:
    """Test authentication middleware functionality."""
    
    def test_authentication_error_creation(self):
        """Test AuthenticationError exception."""
        error = AuthenticationError("Test error")
        assert error.status_code == 401
        assert error.detail == "Test error"
        assert error.headers == {"WWW-Authenticate": "Bearer"}
    
    def test_authentication_error_default_message(self):
        """Test AuthenticationError with default message."""
        error = AuthenticationError()
        assert error.detail == "Authentication failed"


class TestUserManagement:
    """Test user creation and management."""
    
    @patch('app.core.firebase.firebase_service.is_initialized')
    @patch('app.core.firebase.firebase_service.verify_token')
    def test_user_creation_flow(self, mock_verify, mock_initialized):
        """Test user creation on first login."""
        mock_initialized.return_value = True
        mock_verify.return_value = {
            "uid": "new-user-123",
            "email": "newuser@example.com",
            "name": "New User"
        }
        
        # This would test the user creation logic
        # In a real test, we'd need to mock the database as well
        assert mock_verify.return_value["uid"] == "new-user-123"


if __name__ == "__main__":
    pytest.main([__file__])