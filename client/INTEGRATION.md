# GitaGPT Frontend - Backend Integration

This document describes the integration between the GitaGPT frontend and the GeetaManthan+ FastAPI backend.

## Overview

The integration connects the GitaGPT frontend with a complete AI-powered spiritual guidance system that includes:

1. **RoBERTa Emotion Detection** - Analyzes user input for emotional state
2. **ChromaDB Semantic Search** - Finds relevant Bhagavad Gita verses
3. **Gemini AI Reflection Generation** - Creates personalized spiritual guidance
4. **Conversation Management** - Maintains context across interactions
5. **Mood Tracking** - Logs emotional patterns over time

## Architecture

```
GitaGPT Frontend (Next.js)
    ↓ (API calls with Firebase auth)
GeetaManthan+ Backend (FastAPI)
    ↓ (Emotion Detection)
RoBERTa Model → ChromaDB → Gemini API
    ↓ (Response)
Personalized Verse + Reflection
```

## Key Components

### 1. API Client (`lib/api-client.js`)
- Centralized HTTP client for all backend requests
- Handles Firebase authentication tokens
- Provides error handling and logging

### 2. API Services (`lib/api-services.js`)
- Service functions for each backend endpoint
- **chatService.sendMessage()** - Main integration point for complete flow
- Authentication, conversation, verse, mood, and analytics services

### 3. Enhanced AuthContext (`components/shared/AuthContext.jsx`)
- Syncs Firebase authentication with backend
- Manages authentication tokens for API requests
- Tracks backend sync status

### 4. ChatInterface (`components/dashboard/ChatInterface.jsx`)
- Main chat component with full backend integration
- Displays emotion detection results
- Shows relevant verses with Sanskrit and English
- Renders AI-generated reflections
- Supports three interaction modes: Socratic, Wisdom, Story

## Backend Integration Flow

When a user sends a message, the following happens:

1. **Frontend**: User types message and selects interaction mode
2. **API Call**: `chatService.sendMessage()` calls `/api/chat` endpoint
3. **Backend Processing**:
   - RoBERTa model detects emotions from text
   - ChromaDB searches for semantically similar verses
   - Top 3 verses + emotion data + user input sent to Gemini
   - Gemini generates personalized reflection
   - Interaction logged for mood tracking
4. **Frontend Display**: Shows emotion, verses, and reflection

## Environment Configuration

### Required Environment Variables

Create `.env.local` in the GitaGPT directory:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase (existing configuration)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## Running the Integration

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend
```bash
cd GitaGPT
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs

## Features

### ✅ Implemented
- Complete chat interface with emotion detection
- Verse retrieval and display
- AI-generated reflections
- Authentication integration
- Session management
- Error handling with fallbacks

### 🚧 In Progress
- Mood calendar integration
- Analytics dashboard
- Recent chats display

### 📋 Planned
- Offline support
- Push notifications
- Advanced analytics

## API Endpoints Used

| Endpoint | Purpose | Integration Status |
|----------|---------|-------------------|
| `/api/chat` | Main conversation flow | ✅ Complete |
| `/api/auth/login` | Backend user sync | ✅ Complete |
| `/api/conversations/sessions` | Session management | ✅ Complete |
| `/api/logs/mood` | Mood tracking | 🚧 In Progress |
| `/api/analytics/stats` | Analytics data | 📋 Planned |

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: Retry mechanisms and user feedback
2. **Authentication Errors**: Automatic re-authentication
3. **Backend Fallbacks**: Graceful degradation when services fail
4. **User Feedback**: Clear error messages and loading states

## Testing

### Manual Testing Checklist

1. **Authentication**:
   - [ ] Sign up creates backend user
   - [ ] Sign in syncs with backend
   - [ ] Token refresh works

2. **Chat Functionality**:
   - [ ] Messages send successfully
   - [ ] Emotions are detected and displayed
   - [ ] Verses are retrieved and formatted
   - [ ] Reflections are generated
   - [ ] Different interaction modes work

3. **Error Scenarios**:
   - [ ] Backend offline handling
   - [ ] Invalid token handling
   - [ ] Network timeout handling

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS allows `http://localhost:3000`
   - Check backend is running on port 8000

2. **Authentication Failures**:
   - Verify Firebase configuration
   - Check backend Firebase credentials

3. **API Errors**:
   - Check backend logs for detailed errors
   - Verify all required environment variables are set

### Debug Mode

Enable debug logging by adding to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## Performance Considerations

- API responses cached where appropriate
- Loading states prevent multiple simultaneous requests
- Optimistic UI updates for better user experience
- Fallback mechanisms ensure functionality even with service failures

## Security

- All API requests include Firebase authentication tokens
- CORS properly configured for allowed origins
- No sensitive data stored in frontend
- Backend validates all requests

## Deployment

### Development
- Frontend: `npm run dev` (port 3000)
- Backend: `uvicorn app.main:app --reload` (port 8000)

### Production
- Frontend: Deploy to Vercel with environment variables
- Backend: Deploy to Railway/Render with CORS updated for production domain
- Update `NEXT_PUBLIC_API_URL` to production backend URL