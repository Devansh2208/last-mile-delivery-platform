from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ZoneCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    code: str = Field(min_length=2, max_length=50)
    description: str | None = None


class ZoneUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None
    active: bool | None = None


class ZoneResponse(BaseModel):
    id: UUID
    name: str
    code: str
    description: str | None
    active: bool

    model_config = ConfigDict(from_attributes=True)


class ZoneMappingCreate(BaseModel):
    pincode: str = Field(min_length=3, max_length=10)


class ZoneMappingResponse(BaseModel):
    id: UUID
    zone_id: UUID
    pincode: str

    model_config = ConfigDict(from_attributes=True)