from sqlalchemy.orm import Session

from app.models.rate_card import RateCard
from app.models.order import Order


def create_rate_card(db: Session, data):
    rate_card = RateCard(
        zone_id=data.zone_id,
        base_rate=data.base_rate,
        rate_per_kg=data.rate_per_kg,
        active=True,
    )

    db.add(rate_card)
    db.commit()
    db.refresh(rate_card)

    return rate_card


def calculate_order_price(
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

    rate_card = (
        db.query(RateCard)
        .filter(
            RateCard.zone_id == order.zone_id,
            RateCard.active.is_(True),
        )
        .first()
    )

    if not rate_card:
        raise ValueError("No active rate card found for this zone")

    weight_kg = order.package_weight / 1000

    price = (
        rate_card.base_rate
        + (weight_kg * rate_card.rate_per_kg)
    )

    return {
        "tracking_number": order.tracking_number,
        "zone_id": order.zone_id,
        "package_weight_grams": order.package_weight,
        "base_rate": rate_card.base_rate,
        "rate_per_kg": rate_card.rate_per_kg,
        "total_price": round(price, 2),
    }