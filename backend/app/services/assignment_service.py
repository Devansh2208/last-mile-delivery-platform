from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.models.order import Order


def assign_order(
    db: Session,
    tracking_number: str,
):
    order = (
        db.query(Order)
        .filter(Order.tracking_number == tracking_number)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    if order.status != "CREATED":
        raise ValueError("Order is not available for assignment")

    agent = (
        db.query(Agent)
        .filter(
            Agent.active.is_(True),
            Agent.available.is_(True),
        )
        .first()
    )

    if not agent:
        raise ValueError("No available delivery agent")

    agent.available = False
    order.status = "ASSIGNED"

    db.commit()
    db.refresh(order)

    return {
        "message": "Order assigned successfully",
        "tracking_number": order.tracking_number,
        "agent_id": str(agent.id),
        "agent_name": agent.name,
        "status": order.status,
    }