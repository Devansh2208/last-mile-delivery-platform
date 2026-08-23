from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.order import (
    OrderStatus,
    OrderType,
    PaymentType,
)


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str

    pickup_address: str
    delivery_address: str
    delivery_pincode: str

    pickup_zone_id: UUID
    package_weight: int = Field(gt=0)

    length: int = Field(gt=0)
    breadth: int = Field(gt=0)
    height: int = Field(gt=0)

    order_type: OrderType
    payment_type: PaymentType


class OrderResponse(BaseModel):
    id: UUID
    tracking_number: str

    customer_name: str
    customer_phone: str

    pickup_address: str
    delivery_address: str
    delivery_pincode: str

    pickup_zone_id: UUID | None
    delivery_zone_id: UUID | None

    package_weight: int

    length: int
    breadth: int
    height: int

    volumetric_weight: float
    billable_weight: float

    order_type: OrderType
    payment_type: PaymentType

    calculated_charge: float | None
    cod_surcharge: float

    status: OrderStatus

    model_config = ConfigDict(
        from_attributes=True
    )