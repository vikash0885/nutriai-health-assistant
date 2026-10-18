from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.db.session import init_db
from app.api.v1.api import api_router
from app.services.gemini_service import gemini_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# NutriAI — Personal Food, Health & Fitness Intelligence
**Tagline:** Eat Smart, Live Healthy.

NutriAI is a comprehensive wellness intelligence platform combining deterministic nutritional calculations,
symptom pattern recognition, and Google Gemini AI assistance for Indian and global food cultures.

### Medical & Educational Safety Notice
NutriAI is an educational wellness and lifestyle tracking tool. It does not provide medical diagnoses,
clinical treatment plans, or emergency health interventions.
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
origins = settings.BACKEND_CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "gemini_ai_configured": gemini_service.is_configured(),
        "gemini_model": settings.GEMINI_MODEL,
        "database": "connected",
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to NutriAI API. Visit /docs for interactive OpenAPI specifications.",
        "tagline": "Eat Smart, Live Healthy.",
        "version": "1.0.0",
    }
