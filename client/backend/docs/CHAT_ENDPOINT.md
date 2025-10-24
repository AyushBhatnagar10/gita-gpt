# Chat Endpoint Documentation

## Overview

The `/api/chat/` endpoint is the main conversation orchestration endpoint that handles the complete flow of the GeetaManthan+ application. It integrates all the core services to provide a seamless conversational experience.

## Endpoint Details

- **URL**: `POST /api/chat/`
- **Content-Type**: `application/json`

## Request Format

```json
{
  "user_input": "I'm feeling overwhelmed with all my responsibilities at work and home.",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "interaction_mode": "wisdom"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_input` | string | Yes | User's message (1-5000 characters) |
| `user_id` | UUID | Yes | User ID for authentication and logging |
| `session_id` | UUID | No | Conversation session ID (creates new session if not provided) |
| `interaction_mode` | string | No | Interaction mode: 'socratic', 'wisdom', or 'story' (default: 'wisdom') |

### Interaction Modes

- **Socratic**: Reflection-focused approach with guiding questions for self-discovery
- **Wisdom**: Direct interpretation with clear actionable insights (default)
- **Story**: Narrative context from Mahabharata with modern parallels

## Response Format

```json
{
  "reflection": "I can sense the weight of anxiety you're carrying...",
  "emotion": {
    "label": "anxiety",
    "confidence": 0.78,
    "emoji": "😰",
    "color": "#E0E7FF"
  },
  "verses": [
    {
      "id": "BG2.47",
      "chapter": 2,
      "verse": 47,
      "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
      "transliteration": "karmaṇy-evādhikāras te mā phaleṣhu kadāchana",
      "eng_meaning": "You have a right to perform your prescribed duty, but not to the fruits of action.",
      "hin_meaning": "तुम्हारा अधिकार केवल कर्म करने में है, फल में नहीं।",
      "similarity_score": 0.87
    }
  ],
  "session_id": "550e8400-e29b-41d4-a716-446655440001",
  "interaction_mode": "wisdom",
  "fallback_used": false
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `reflection` | string | Generated reflection with verse and commentary |
| `emotion` | object | Detected emotion data with label, confidence, emoji, and color |
| `verses` | array | List of relevant verses from semantic search |
| `session_id` | UUID | Session ID for continued conversation |
| `interaction_mode` | string | Mode used for generation |
| `fallback_used` | boolean | Whether any fallback mechanisms were triggered |

## Processing Flow

The endpoint orchestrates the following steps:

1. **Emotion Detection**: Analyzes user input using RoBERTa-GoEmotions model
2. **Verse Search**: Finds semantically relevant verses using ChromaDB vector search
3. **Context Retrieval**: Gets conversation history if session exists
4. **Reflection Generation**: Creates empathetic commentary using Gemini API
5. **Conversation Storage**: Stores messages in PostgreSQL database
6. **Mood Logging**: Logs interaction for analytics and mood tracking

## Error Handling

The endpoint implements comprehensive error handling with graceful fallbacks:

- **Emotion Detection Failure** → Returns neutral emotion
- **Vector Search Failure** → Uses fallback verse (BG2.47)
- **LLM API Failure** → Generates template-based reflection
- **Database Issues** → Continues with temporary session ID
- **Complete Failure** → Returns minimal guidance with fallback verse

## Health Check

- **URL**: `GET /api/chat/health`
- **Response**: Status of all integrated services

```json
{
  "status": "healthy",
  "services": {
    "emotion_detection": {"status": "healthy", "test_passed": true},
    "vector_search": {"status": "healthy", "test_passed": true, "verses_count": 700},
    "reflection_generation": {"status": "healthy", "test_passed": true},
    "database": {"status": "healthy", "connection": "active"}
  },
  "message": "Chat orchestration service is operational"
}
```

## Example Usage

### cURL Example

```bash
curl -X POST "http://localhost:8000/api/chat/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "I am feeling anxious about my future",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "interaction_mode": "wisdom"
  }'
```

### Python Example

```python
import requests
import uuid

response = requests.post(
    "http://localhost:8000/api/chat/",
    json={
        "user_input": "I am struggling with self-doubt",
        "user_id": str(uuid.uuid4()),
        "interaction_mode": "socratic"
    }
)

data = response.json()
print(f"Emotion: {data['emotion']['label']}")
print(f"Reflection: {data['reflection']}")
```

### JavaScript Example

```javascript
const response = await fetch('/api/chat/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_input: "I need guidance on making difficult decisions",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    interaction_mode: "story"
  })
});

const data = await response.json();
console.log('Detected emotion:', data.emotion.label);
console.log('Verses found:', data.verses.length);
```

## Error Responses

### Validation Error (422)

```json
{
  "detail": [
    {
      "loc": ["body", "user_input"],
      "msg": "ensure this value has at least 1 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

### Invalid Mode Error (400)

```json
{
  "detail": "Invalid interaction mode 'invalid_mode'. Must be one of: ['socratic', 'wisdom', 'story']"
}
```

### Service Unavailable (500)

```json
{
  "detail": "Unable to process your request. Please try again later."
}
```

## Performance Considerations

- **Response Time**: Typically 2-5 seconds depending on LLM API latency
- **Fallback Performance**: <1 second when using template-based fallbacks
- **Concurrent Requests**: Supports multiple simultaneous users
- **Rate Limiting**: Consider implementing rate limiting for production use

## Integration Notes

This endpoint is designed to be the primary interface for frontend applications. It handles all the complexity of orchestrating multiple AI services while providing a simple, reliable API for chat functionality.

The endpoint maintains conversation context automatically and provides comprehensive error handling to ensure users always receive meaningful guidance, even when individual services experience issues.