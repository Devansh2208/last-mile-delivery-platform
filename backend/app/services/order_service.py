import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus
from app.models.zone import Zone
from app.models.zone_mapping import ZoneMapping
from app.schemas.order import OrderCreate


VOLUMETRIC_DIVISOR = 5000


def create_order(
    db: Session,
    data: OrderCreate,
) -> Order:

    # Validate pickup zone
    pickup_zone = db.execute(
        select(Zone).where(
            Zone.id == data.pickup_zone_id,
            Zone.active.is_(True),
        )
    ).scalar_one_or_none()

    if not pickup_zone:
        raise ValueError(
            "Invalid or inactive pickup zone"
        )

    # Resolve delivery zone from delivery pincode
    delivery_zone = db.execute(
        select(Zone)
        .join(
            ZoneMapping,
            ZoneMapping.zone_id == Zone.id,
        )
        .where(
            ZoneMapping.pincode == data.delivery_pincode
        )
        .where(
            Zone.active.is_(True)
        )
    ).scalar_one_or_none()

    if not delivery_zone:
        raise ValueError(
            "No active delivery zone found for this pincode"
        )

    # Volumetric weight in KG
    volumetric_weight = (
        data.length
        * data.breadth
        * data.height
    ) / VOLUMETRIC_DIVISOR

    # Actual weight is stored in grams
    actual_weight_kg = data.package_weight / 1000

    billable_weight = max(
        actual_weight_kg,
        volumetric_weight,
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

        pickup_zone_id=data.pickup_zone_id,
        delivery_zone_id=delivery_zone.id,

        package_weight=data.package_weight,

        length=data.length,
        breadth=data.breadth,
        height=data.height,

        volumetric_weight=round(
            volumetric_weight,
            2,
        ),

        billable_weight=round(
            billable_weight,
            2,
        ),

        order_type=data.order_type,
        payment_type=data.payment_type,

        calculated_charge=None,
        cod_surcharge=0,

        status=OrderStatus.CREATED,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def get_orders(
    db: Session,
) -> list[Order]:

    result = db.execute(
        select(Order)
        .order_by(Order.created_at.desc())
    )

    return list(
        result.scalars().all()
    )


def get_order(
    db: Session,
    tracking_number: str,
) -> Order | None:

    result = db.execute(
        select(Order)
        .where(
            Order.tracking_number
            == tracking_number
        )
    )

    return result.scalar_one_or_none()