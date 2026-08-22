from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ZoneMappingCreate(BaseModel):
    pincode: str


class ZoneMappingResponse(BaseModel):
    id: UUID
    zone_id: UUID
    pincode: str

    model_config = ConfigDict(from_attributes=True)