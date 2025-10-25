# GitaGPT Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Next.js + React + Tailwind)                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Chat    │  │  Mode    │  │  Dark    │  │  Session │      │
│  │  Input   │  │ Selector │  │  Mode    │  │  Manager │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │           Message Display Area                        │     │
│  │  • User messages                                      │     │
│  │  • AI responses with verses                          │     │
│  │  • Emotion indicators                                │     │
│  │  • Loading states                                    │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (with Firebase Auth)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (FastAPI)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Authentication Middleware                    │ │
│  │         (Firebase JWT Token Verification)                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  Chat Orchestration API                   │ │
│  │                    (/api/v1/chat/)                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    INTENT CLASSIFICATION                        │
│                  (facebook/bart-large-mnli)                     │
│                                                                 │
│  Input: "I'm feeling anxious"                                  │
│  Output: emotional_query (confidence: 0.89)                    │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ casual_chat  │  │ emotional_   │  │ spiritual_   │        │
│  │              │  │ query        │  │ guidance     │        │
│  │ 40-60% of    │  │ 30-40% of    │  │ 10-20% of    │        │
│  │ queries      │  │ queries      │  │ queries      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         ↓                    ↓                    ↓
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  CASUAL CHAT   │  │  EMOTIONAL     │  │  SPIRITUAL     │
│  PIPELINE      │  │  PIPELINE      │  │  PIPELINE      │
│                │  │                │  │                │
│  Skip emotion  │  │  ✓ Emotion     │  │  Skip emotion  │
│  Skip verses   │  │  ✓ Verses      │  │  ✓ Verses      │
│  ✓ Gemini      │  │  ✓ Gemini      │  │  ✓ Gemini      │
│                │  │                │  │                │
│  1-2s          │  │  3-5s          │  │  2-4s          │
└────────────────┘  └────────────────┘  └────────────────┘
         │                    │                    │
         │                    ↓                    │
         │          ┌────────────────┐            │
         │          │    EMOTION     │            │
         │          │   DETECTION    │            │
         │          │   (RoBERTa)    │            │
         │          │                │            │
         │          │  Input: text   │            │
         │          │  Output:       │            │
         │          │  - label       │            │
         │          │  - confidence  │            │
         │          │  - emoji       │            │
         │          │  - color       │            │
         │          └────────────────┘            │
         │                    │                    │
         │                    ↓                    ↓
         │          ┌─────────────────────────────┐
         │          │     VECTOR SEARCH           │
         │          │      (ChromaDB)             │
         │          │                             │
         │          │  • Semantic similarity      │
         │          │  • Emotion-aware search     │
         │          │  • Top-k retrieval          │
         │          │                             │
         │          │  Input: query + emotion     │
         │          │  Output: relevant verses    │
         │          └─────────────────────────────┘
         │                    │                    │
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSE GENERATION                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Casual     │  │  Reflection  │  │  Reflection  │        │
│  │   Chat       │  │  Generation  │  │  Generation  │        │
│  │   Service    │  │  Service     │  │  Service     │        │
│  │              │  │              │  │              │        │
│  │  Gemini API  │  │  Gemini API  │  │  Gemini API  │        │
│  │  (short      │  │  (full       │  │  (verse      │        │
│  │   prompt)    │  │   prompt)    │  │   focused)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  Fallback: Template-based responses if API fails               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  PostgreSQL  │  │   ChromaDB   │  │   Firebase   │        │
│  │              │  │              │  │              │        │
│  │ • Users      │  │ • Verses     │  │ • Auth       │        │
│  │ • Sessions   │  │ • Embeddings │  │ • Tokens     │        │
│  │ • Messages   │  │ • Metadata   │  │              │        │
│  │ • Emotions   │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Examples

### Example 1: Casual Chat

```
User: "Hello!"
  ↓
Frontend → API Gateway → Intent Classifier
  ↓
Intent: casual_chat (0.95)
  ↓
Casual Chat Service → Gemini API
  ↓
Response: "🙏 Namaste! I'm GitaGPT..."
  ↓
Frontend displays response
  ↓
Total time: 1-2 seconds
```

### Example 2: Emotional Query

```
User: "I'm feeling very anxious about my future"
  ↓
Frontend → API Gateway → Intent Classifier
  ↓
Intent: emotional_query (0.89)
  ↓
Emotion Detection (RoBERTa)
  ↓
Emotion: anxiety (0.78) 😰
  ↓
Vector Search (ChromaDB)
  ↓
Verses: [BG2.47, BG2.48, BG2.50]
  ↓
Reflection Generation (Gemini)
  ↓
Response: "I sense your anxiety... [verse] [guidance]"
  ↓
Store in database (conversation + mood log)
  ↓
Frontend displays: emotion + verses + reflection
  ↓
Total time: 3-5 seconds
```

### Example 3: Spiritual Guidance

```
User: "What does Krishna say about dharma?"
  ↓
Frontend → API Gateway → Intent Classifier
  ↓
Intent: spiritual_guidance (0.92)
  ↓
Skip emotion detection
  ↓
Vector Search (ChromaDB)
  ↓
Verses: [BG3.35, BG18.47, BG2.31]
  ↓
Reflection Generation (Gemini)
  ↓
Response: "Krishna teaches that dharma... [verses] [explanation]"
  ↓
Store in database (conversation only)
  ↓
Frontend displays: verses + reflection
  ↓
Total time: 2-4 seconds
```

## Component Interactions

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│                                                                 │
│  React Components:                                              │
│  • ChatInterface (main component)                               │
│  • MessageList (displays conversation)                          │
│  • InputArea (user input)                                       │
│  • ModeSelector (wisdom/socratic/story)                         │
│  • EmotionIndicator (shows detected emotion)                    │
│  • VerseCard (displays verses)                                  │
│                                                                 │
│  API Client (lib/api.js):                                       │
│  • sendChatMessage()                                            │
│  • createSession()                                              │
│  • getConversationContext()                                     │
│  • endSession()                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│                                                                 │
│  Endpoints:                                                     │
│  • POST /api/v1/chat/                                          │
│  • POST /api/v1/conversations/sessions                         │
│  • GET  /api/v1/conversations/{id}/context                     │
│  • POST /api/v1/conversations/{id}/end                         │
│  • GET  /api/v1/chat/health                                    │
│                                                                 │
│  Middleware:                                                    │
│  • Authentication (Firebase JWT)                                │
│  • CORS                                                         │
│  • Error handling                                               │
│  • Logging                                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│                                                                 │
│  Core Services:                                                 │
│  • IntentClassificationService                                  │
│  • EmotionDetectionService                                      │
│  • VectorSearchService                                          │
│  • ReflectionGenerationService                                  │
│  • CasualChatService                                            │
│  • ConversationManager                                          │
│  • LoggingService                                               │
│                                                                 │
│  Each service is:                                               │
│  • Singleton pattern                                            │
│  • Dependency injection                                         │
│  • Error handling with fallbacks                                │
│  • Async/await support                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│                                                                 │
│  Models (SQLAlchemy):                                           │
│  • User                                                         │
│  • ConversationSession                                          │
│  • ConversationMessage                                          │
│  • EmotionLog                                                   │
│  • Verse (metadata)                                             │
│                                                                 │
│  Repositories:                                                  │
│  • PostgreSQL (structured data)                                 │
│  • ChromaDB (vector embeddings)                                 │
│  • Firebase (authentication)                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                                                                 │
│  Framework:     Next.js 14 (React 18)                          │
│  Styling:       Tailwind CSS                                    │
│  Icons:         Lucide React                                    │
│  Auth:          Firebase Client SDK                             │
│  State:         React Hooks (useState, useEffect)               │
│  HTTP:          Fetch API                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                                                                 │
│  Framework:     FastAPI (Python 3.8+)                          │
│  Server:        Uvicorn (ASGI)                                  │
│  Database:      PostgreSQL + SQLAlchemy                         │
│  Vector DB:     ChromaDB                                        │
│  Auth:          Firebase Admin SDK                              │
│  Validation:    Pydantic                                        │
│  Migrations:    Alembic                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        AI/ML MODELS                             │
│                                                                 │
│  Intent:        facebook/bart-large-mnli                        │
│                 (Zero-shot classification)                      │
│                                                                 │
│  Emotion:       SamLowe/roberta-base-go_emotions               │
│                 (ONNX optimized, 28 emotions)                   │
│                                                                 │
│  Embeddings:    all-mpnet-base-v2                              │
│                 (Sentence transformers)                         │
│                                                                 │
│  LLM:           Google Gemini 2.0 Flash                        │
│                 (Response generation)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION SETUP                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Load Balancer                          │ │
│  │                   (Nginx / Caddy)                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                  │
│              ┌───────────────┴───────────────┐                 │
│              ↓                               ↓                 │
│  ┌────────────────────┐          ┌────────────────────┐       │
│  │   Frontend Server  │          │   Backend Server   │       │
│  │   (Next.js)        │          │   (FastAPI)        │       │
│  │   Port: 3000       │          │   Port: 8000       │       │
│  └────────────────────┘          └────────────────────┘       │
│                                              │                  │
│                              ┌───────────────┼───────────────┐ │
│                              ↓               ↓               ↓ │
│                  ┌──────────────┐  ┌──────────────┐  ┌──────┐│
│                  │  PostgreSQL  │  │   ChromaDB   │  │ Fire │││
│                  │   Database   │  │  Vector DB   │  │ base │││
│                  └──────────────┘  └──────────────┘  └──────┘││
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
│                                                                 │
│  Layer 1: Authentication                                        │
│  • Firebase JWT tokens                                          │
│  • Token verification on every request                          │
│  • User session management                                      │
│                                                                 │
│  Layer 2: Authorization                                         │
│  • User can only access own data                                │
│  • Session ownership verification                               │
│  • Role-based access (future)                                   │
│                                                                 │
│  Layer 3: Data Protection                                       │
│  • HTTPS in production                                          │
│  • Environment variables for secrets                            │
│  • Database connection encryption                               │
│  • API key rotation                                             │
│                                                                 │
│  Layer 4: Rate Limiting                                         │
│  • Per-user request limits                                      │
│  • API endpoint throttling                                      │
│  • DDoS protection                                              │
│                                                                 │
│  Layer 5: Input Validation                                      │
│  • Pydantic models                                              │
│  • SQL injection prevention                                     │
│  • XSS protection                                               │
│  • CORS configuration                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING STACK                             │
│                                                                 │
│  Metrics:                                                       │
│  • Response times by intent                                     │
│  • API call counts                                              │
│  • Error rates                                                  │
│  • Fallback usage                                               │
│  • Database query performance                                   │
│                                                                 │
│  Logging:                                                       │
│  • Structured JSON logs                                         │
│  • Log levels (DEBUG, INFO, WARNING, ERROR)                     │
│  • Request/response logging                                     │
│  • Error stack traces                                           │
│                                                                 │
│  Alerts:                                                        │
│  • High error rates                                             │
│  • Slow response times                                          │
│  • Database connection issues                                   │
│  • API quota warnings                                           │
│                                                                 │
│  Analytics:                                                     │
│  • User engagement metrics                                      │
│  • Intent distribution                                          │
│  • Emotion trends                                               │
│  • Popular verses                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

**This architecture provides**:
- ✅ Scalability through microservices pattern
- ✅ Performance through intelligent routing
- ✅ Reliability through multiple fallback layers
- ✅ Security through multi-layer protection
- ✅ Observability through comprehensive monitoring

**Ready for production deployment!** 🚀
