from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TrackingCreate(BaseModel):
    status: str
    location: str | None = None
    description: str | None = None


class TrackingResponse(BaseModel):
    id: UUID
    order_id: UUID
    status: str
    location: str | None
    description: str | None

    model_config = ConfigDict(from_attributes=True)