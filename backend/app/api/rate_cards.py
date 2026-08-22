from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.rate_card import (
    RateCardCreate,
    RateCardResponse,
)
from app.services.pricing_service import (
    create_rate_card,
    calculate_order_price,
)

router = APIRouter()


@router.post(
    "/",
    response_model=RateCardResponse,
    status_code=201,
)
def create_rate_card_endpoint(
    data: RateCardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    return create_rate_card(db, data)


@router.get("/calculate/{tracking_number}")
def calculate_price(
    tracking_number: str,
    db: Session = Depends(get_db),
):
    try:
        return calculate_order_price(
            db,
            tracking_number,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )