from fastapi import APIRouter
from .auth import router as auth_router
from .emotions import router as emotions_router
from .verses import router as verses_router
from .reflections import router as reflections_router
from .conversations import router as conversations_router
from .logs import router as logs_router
from .analytics import router as analytics_router
from .chat import router as chat_router

api_router = APIRouter()

# Include all API routers
api_router.include_router(auth_router, prefix="/api")
api_router.include_router(chat_router, prefix="/api")
api_router.include_router(emotions_router, prefix="/api")
api_router.include_router(verses_router, prefix="/api")
api_router.include_router(reflections_router, prefix="/api")
api_router.include_router(conversations_router, prefix="/api")
api_router.include_router(logs_router, prefix="/api")
api_router.include_router(analytics_router, prefix="/api")

__all__ = ["api_router"]