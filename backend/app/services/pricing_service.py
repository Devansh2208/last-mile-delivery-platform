from sqlalchemy.orm import Session

from app.models.order import (
    Order,
    PaymentType,
)
from app.models.rate_card import RateCard


def create_rate_card(
    db: Session,
    data,
):

    rate_card = RateCard(
        origin_zone_id=data.origin_zone_id,
        destination_zone_id=data.destination_zone_id,
        order_type=data.order_type,
        base_rate=data.base_rate,
        rate_per_kg=data.rate_per_kg,
        cod_surcharge=data.cod_surcharge,
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
        .filter(
            Order.tracking_number
            == tracking_number
        )
        .first()
    )

    if not order:
        raise ValueError(
            "Order not found"
        )

    rate_card = (
        db.query(RateCard)
        .filter(
            RateCard.origin_zone_id
            == order.pickup_zone_id,

            RateCard.destination_zone_id
            == order.delivery_zone_id,

            RateCard.order_type
            == order.order_type.value,

            RateCard.active.is_(True),
        )
        .first()
    )

    if not rate_card:
        raise ValueError(
            "No active rate card found "
            "for this route and order type"
        )

    billable_weight = float(
        order.billable_weight
    )

    shipping_price = (
        rate_card.base_rate
        + (
            billable_weight
            * rate_card.rate_per_kg
        )
    )

    cod_surcharge = 0

    if order.payment_type == PaymentType.COD:
        cod_surcharge = rate_card.cod_surcharge

    total_price = (
        shipping_price
        + cod_surcharge
    )

    order.calculated_charge = round(
        total_price,
        2,
    )

    order.cod_surcharge = round(
        cod_surcharge,
        2,
    )

    db.commit()
    db.refresh(order)

    return {
        "tracking_number": order.tracking_number,
        "pickup_zone_id": order.pickup_zone_id,
        "delivery_zone_id": order.delivery_zone_id,
        "package_weight_grams": order.package_weight,
        "volumetric_weight": float(
            order.volumetric_weight
        ),
        "billable_weight": billable_weight,
        "order_type": order.order_type.value,
        "payment_type": order.payment_type.value,
        "base_rate": rate_card.base_rate,
        "rate_per_kg": rate_card.rate_per_kg,
        "cod_surcharge": cod_surcharge,
        "total_price": round(
            total_price,
            2,
        ),
    }