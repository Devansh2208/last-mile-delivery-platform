from uuid import UUID

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDMixin


class RateCard(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "rate_cards"

    zone_id: Mapped[UUID] = mapped_column(
        ForeignKey("zones.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    base_rate: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    rate_per_kg: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )