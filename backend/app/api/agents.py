from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.models.agent import Agent
from app.models.user import User, UserRole
from app.schemas.agent import AgentCreate, AgentResponse
from app.services.assignment_service import assign_order

router = APIRouter()


@router.post(
    "/",
    response_model=AgentResponse,
    status_code=201,
)
def create_agent(
    data: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    agent = Agent(
        name=data.name,
        phone=data.phone,
        active=True,
        available=True,
    )

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return agent


@router.get("/")
def list_agents(
    db: Session = Depends(get_db),
):
    return db.query(Agent).all()


@router.post("/assign/{tracking_number}")
def assign_order_endpoint(
    tracking_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    try:
        return assign_order(
            db,
            tracking_number,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )