from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.tracking import (
    TrackingCreate,
    TrackingResponse,
)
from app.services.tracking_service import (
    add_tracking_event,
    get_tracking_events,
)

router = APIRouter()


@router.post(
    "/{tracking_number}",
    response_model=TrackingResponse,
    status_code=201,
)
def create_tracking_event(
    tracking_number: str,
    data: TrackingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(
            UserRole.AGENT,
            UserRole.ADMIN,
        )
    ),
):
    try:
        return add_tracking_event(
            db,
            tracking_number,
            data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get(
    "/{tracking_number}",
    response_model=list[TrackingResponse],
)
def list_tracking_events(
    tracking_number: str,
    db: Session = Depends(get_db),
):
    try:
        return get_tracking_events(
            db,
            tracking_number,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )