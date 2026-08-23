from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import agents, auth, orders, rate_cards, tracking, zones
from app.api.health import router as health_router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Last-Mile Delivery Management Platform",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://last-mile-delivery-platform-4cto.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health
app.include_router(
    health_router,
    prefix="/api",
)


# Authentication
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"],
)


# Zones
app.include_router(
    zones.router,
    prefix="/zones",
    tags=["Zones"],
)


# Orders
app.include_router(
    orders.router,
    prefix="/orders",
    tags=["Orders"],
)


# Agents
app.include_router(
    agents.router,
    prefix="/agents",
    tags=["Agents"],
)


# Tracking
app.include_router(
    tracking.router,
    prefix="/tracking",
    tags=["Tracking"],
)


# Rate Cards
app.include_router(
    rate_cards.router,
    prefix="/rate-cards",
    tags=["Rate Cards"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
    }