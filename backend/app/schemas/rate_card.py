from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RateCardCreate(BaseModel):
    zone_id: UUID
    base_rate: int
    rate_per_kg: int


class RateCardResponse(BaseModel):
    id: UUID
    zone_id: UUID
    base_rate: int
    rate_per_kg: int
    active: bool

    model_config = ConfigDict(from_attributes=True)