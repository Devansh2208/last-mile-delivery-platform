from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDMixin


class OrderStatus(str, Enum):
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    RESCHEDULED = "RESCHEDULED"
    CANCELLED = "CANCELLED"


class OrderType(str, Enum):
    B2B = "B2B"
    B2C = "B2C"


class PaymentType(str, Enum):
    PREPAID = "PREPAID"
    COD = "COD"


class Order(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "orders"

    tracking_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    customer_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    customer_phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    pickup_address: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    delivery_address: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    delivery_pincode: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        index=True,
    )

    pickup_zone_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("zones.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    delivery_zone_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("zones.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    package_weight: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    length: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    breadth: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    height: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    volumetric_weight: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    billable_weight: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    order_type: Mapped[OrderType] = mapped_column(
        SQLEnum(OrderType),
        nullable=False,
    )

    payment_type: Mapped[PaymentType] = mapped_column(
        SQLEnum(PaymentType),
        nullable=False,
    )

    calculated_charge: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    cod_surcharge: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus),
        default=OrderStatus.CREATED,
        nullable=False,
    )