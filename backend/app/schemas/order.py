from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.order import OrderStatus


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    pickup_address: str
    delivery_address: str
    delivery_pincode: str
    package_weight: int = Field(gt=0)


class OrderResponse(BaseModel):
    id: UUID
    tracking_number: str

    customer_name: str
    customer_phone: str

    pickup_address: str
    delivery_address: str
    delivery_pincode: str

    zone_id: UUID | None
    package_weight: int
    status: OrderStatus

    model_config = ConfigDict(from_attributes=True)