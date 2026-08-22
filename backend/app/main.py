from fastapi import FastAPI

from app.api.health import router as health_router
from app.core.config import settings
from app.api import orders
from app.api import auth
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Last-Mile Delivery Management Platform",
)

app.include_router(
    health_router,
    prefix="/api",
)
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"],
)
from app.api import zones

app.include_router(
    zones.router,
    prefix="/zones",
    tags=["Zones"],
)
app.include_router(
    orders.router,
    prefix="/orders",
    tags=["Orders"],
)
from app.api import agents

app.include_router(
    agents.router,
    prefix="/agents",
    tags=["Agents"],
)
from app.api import tracking

app.include_router(
    tracking.router,
    prefix="/tracking",
    tags=["Tracking"],
)
from app.api import rate_cards

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