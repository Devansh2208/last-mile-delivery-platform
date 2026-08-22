from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AgentCreate(BaseModel):
    name: str
    phone: str


class AgentResponse(BaseModel):
    id: UUID
    name: str
    phone: str
    active: bool
    available: bool

    model_config = ConfigDict(from_attributes=True)