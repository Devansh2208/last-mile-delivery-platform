import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus
from app.models.zone import Zone
from app.models.zone_mapping import ZoneMapping
from app.schemas.order import OrderCreate


def create_order(
    db: Session,
    data: OrderCreate,
) -> Order:

    # Find zone using delivery pincode
    result = db.execute(
        select(Zone)
        .join(
            ZoneMapping,
            ZoneMapping.zone_id == Zone.id,
        )
        .where(
            ZoneMapping.pincode == data.delivery_pincode
        )
        .where(
            Zone.active == True
        )
    )

    zone = result.scalar_one_or_none()

    if not zone:
        raise ValueError(
            "No active delivery zone found for this pincode"
        )

    tracking_number = (
        f"LM-{uuid.uuid4().hex[:10].upper()}"
    )

    order = Order(
        tracking_number=tracking_number,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        pickup_address=data.pickup_address,
        delivery_address=data.delivery_address,
        delivery_pincode=data.delivery_pincode,
        zone_id=zone.id,
        package_weight=data.package_weight,
        status=OrderStatus.CREATED,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def get_orders(db: Session) -> list[Order]:

    result = db.execute(
        select(Order)
        .order_by(Order.created_at.desc())
    )

    return list(result.scalars().all())


def get_order(
    db: Session,
    tracking_number: str,
) -> Order | None:

    result = db.execute(
        select(Order)
        .where(
            Order.tracking_number == tracking_number
        )
    )

    return result.scalar_one_or_none()