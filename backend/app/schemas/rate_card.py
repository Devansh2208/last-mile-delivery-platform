from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RateCardCreate(BaseModel):
    origin_zone_id: UUID
    destination_zone_id: UUID

    order_type: str = Field(
        pattern="^(B2B|B2C)$"
    )

    base_rate: int = Field(ge=0)
    rate_per_kg: int = Field(ge=0)
    cod_surcharge: int = Field(
        default=0,
        ge=0,
    )


class RateCardResponse(BaseModel):
    id: UUID

    origin_zone_id: UUID
    destination_zone_id: UUID

    order_type: str

    base_rate: int
    rate_per_kg: int
    cod_surcharge: int

    active: bool

    model_config = ConfigDict(
        from_attributes=True
    )