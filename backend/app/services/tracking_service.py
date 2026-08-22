from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.tracking import TrackingEvent


def add_tracking_event(
    db: Session,
    tracking_number: str,
    data,
):
    order = (
        db.query(Order)
        .filter(Order.tracking_number == tracking_number)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    event = TrackingEvent(
        order_id=order.id,
        status=data.status,
        location=data.location,
        description=data.description,
    )

    order.status = data.status

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_tracking_events(
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

    return (
        db.query(TrackingEvent)
        .filter(TrackingEvent.order_id == order.id)
        .order_by(TrackingEvent.created_at.asc())
        .all()
    )