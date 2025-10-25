# Firebase Authentication Implementation

## Overview

This document describes the Firebase Authentication integration implemented for the GeetaManthan+ backend API. The implementation provides secure user authentication using Firebase JWT tokens and automatic user management in PostgreSQL.

## Components Implemented

### 1. Firebase Service (`app/core/firebase.py`)

**Purpose**: Manages Firebase Admin SDK initialization and token verification.

**Key Features**:
- Automatic Firebase initialization with service account credentials
- Fallback to default credentials for production environments
- JWT token verification with error handling
- User information retrieval from Firebase

**Configuration**:
- Uses `FIREBASE_CREDENTIALS_PATH` environment variable
- Supports both service account JSON file and environment variables
- Graceful degradation when Firebase is not configured

### 2. Authentication Middleware (`app/core/auth.py`)

**Purpose**: Provides FastAPI dependencies for authentication and authorization.

**Key Dependencies**:
- `require_auth`: Requires valid authentication (raises 401 if not authenticated)
- `optional_auth`: Optional authentication (returns None if not authenticated)
- `verify_firebase_token`: Verifies Firebase JWT tokens
- `get_current_user`: Gets/creates user from database based on Firebase token

**Features**:
- Automatic user creation on first login
- Session management with last active timestamp updates
- User access control helpers
- Comprehensive error handling with custom exceptions

### 3. Authentication API (`app/api/auth.py`)

**Purpose**: Provides endpoints for user profile management and authentication status.

**Endpoints**:
- `GET /api/auth/me`: Get current user profile
- `PUT /api/auth/me`: Update user profile (display name, preferences)
- `DELETE /api/auth/me`: Delete user account and all data
- `GET /api/auth/status`: Check authentication status (works with/without auth)
- `GET /api/auth/health`: Authentication service health check

## Protected Endpoints

The following endpoints now require authentication:

### Chat API (`/api/chat/`)
- `POST /api/chat/`: Main conversation endpoint
- Automatically uses authenticated user's ID for logging and session management

### Conversations API (`/api/conversations/`)
- `POST /api/conversations/sessions`: Create conversation session
- `POST /api/conversations/messages`: Add message to session
- `GET /api/conversations/{session_id}/context`: Get conversation context
- `POST /api/conversations/{session_id}/end`: End conversation session
- `GET /api/conversations/{session_id}`: Get session details

**Security**: All conversation endpoints verify session ownership to prevent unauthorized access.

### Logs API (`/api/logs/`)
- `POST /api/logs/interaction`: Log user interaction
- `GET /api/logs/mood`: Get mood calendar data
- `GET /api/logs/mood/month`: Get monthly mood data

### Analytics API (`/api/analytics/`)
- `GET /api/analytics/stats`: Get emotion statistics
- `GET /api/analytics/patterns`: Get emotion patterns
- `GET /api/analytics/summary`: Get analytics summary
- `GET /api/analytics/emotions/top`: Get top emotions

## Public Endpoints

These endpoints remain public (no authentication required):

### Utility APIs
- `POST /api/emotions/detect`: Emotion detection service
- `POST /api/verses/search`: Verse search service
- `POST /api/reflections/generate`: Reflection generation service

### Health Checks
- All `/health` endpoints across services
- `GET /api/auth/status`: Authentication status check

## User Management

### Automatic User Creation
When a user authenticates for the first time:
1. Firebase token is verified
2. User record is created in PostgreSQL with Firebase UID
3. User profile includes email, display name from Firebase
4. Empty preferences object is initialized

### User Data Model
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    preferences JSONB DEFAULT '{}'::jsonb
);
```

### Data Relationships
- Users have cascade delete relationships with:
  - Conversation sessions and messages
  - Emotion logs
  - All analytics data

## Security Features

### Token Verification
- Firebase JWT tokens are verified on every request
- Tokens must be valid and not expired
- User information is extracted from verified tokens

### Access Control
- Users can only access their own data
- Session ownership is verified for conversation endpoints
- User ID is automatically extracted from authentication context

### Error Handling
- Graceful degradation when Firebase is not configured
- Comprehensive error messages for debugging
- Secure error responses that don't leak sensitive information

## Configuration

### Environment Variables
```env
# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Alternative: Environment-based configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
# ... other Firebase config variables
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Generate service account credentials
4. Place credentials file in backend directory
5. Update environment variables

## Testing

### Test Coverage
- Firebase service initialization
- Token verification (valid/invalid tokens)
- Authentication middleware functionality
- Protected endpoint access control
- User creation and management flows

### Test Files
- `tests/test_authentication.py`: Comprehensive authentication tests

## Usage Examples

### Frontend Integration
```javascript
// Get Firebase ID token
const idToken = await user.getIdToken();

// Make authenticated request
const response = await fetch('/api/chat/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_input: "I'm feeling anxious about work",
    interaction_mode: "wisdom"
  })
});
```

### Backend Usage
```python
from app.core.auth import require_auth
from app.models.user import User

@router.post("/protected-endpoint")
async def protected_endpoint(
    current_user: User = Depends(require_auth)
):
    # current_user is automatically populated from Firebase token
    user_id = current_user.id
    # ... endpoint logic
```

## Migration Notes

### Breaking Changes
- All protected endpoints now require `Authorization: Bearer <firebase-token>` header
- `user_id` parameter removed from request bodies (automatically extracted from token)
- Conversation endpoints now verify session ownership

### Backward Compatibility
- Public utility endpoints (emotions, verses, reflections) remain unchanged
- Health check endpoints remain public
- Error responses maintain same format

## Deployment Considerations

### Production Setup
1. Use Firebase environment variables instead of JSON file
2. Configure Firebase project for production domain
3. Set up proper CORS policies
4. Monitor authentication service health

### Security Best Practices
- Never commit Firebase credentials to version control
- Use environment variables for sensitive configuration
- Regularly rotate service account keys
- Monitor authentication logs for suspicious activity

## Troubleshooting

### Common Issues
1. **"Firebase not initialized"**: Check credentials file path and validity
2. **"Invalid token"**: Verify token is not expired and from correct Firebase project
3. **"Access denied"**: User trying to access another user's data
4. **403 vs 401 errors**: FastAPI HTTPBearer returns 403 for missing auth header

### Debug Steps
1. Check Firebase service health: `GET /api/auth/health`
2. Verify token validity: `GET /api/auth/status` with token
3. Check server logs for Firebase initialization messages
4. Validate environment variables and credentials file

## Future Enhancements

### Planned Features
- Role-based access control (admin vs user)
- API rate limiting per user
- Session management and refresh tokens
- Multi-factor authentication support
- OAuth provider integration (Google, Apple)

### Performance Optimizations
- Token caching to reduce Firebase API calls
- User session caching
- Batch user operations
- Connection pooling for Firebase Admin SDK