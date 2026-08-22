from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.zone import ZoneCreate, ZoneResponse
from app.schemas.zone_mapping import (
    ZoneMappingCreate,
    ZoneMappingResponse,
)
from app.services.zone_service import (
    create_zone,
    create_zone_mapping,
    get_zone,
    get_zone_mappings,
    get_zones,
    resolve_zone_by_pincode,
)

router = APIRouter()


@router.post(
    "/",
    response_model=ZoneResponse,
    status_code=201,
)
def create_zone_endpoint(
    data: ZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    return create_zone(db, data)


@router.get(
    "/",
    response_model=list[ZoneResponse],
)
def list_zones(
    db: Session = Depends(get_db),
):
    return get_zones(db)


@router.get(
    "/{zone_id}",
    response_model=ZoneResponse,
)
def get_zone_endpoint(
    zone_id: UUID,
    db: Session = Depends(get_db),
):
    zone = get_zone(db, zone_id)

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Zone not found",
        )

    return zone


@router.post(
    "/{zone_id}/mappings",
    response_model=ZoneMappingResponse,
    status_code=201,
)
def create_mapping_endpoint(
    zone_id: UUID,
    data: ZoneMappingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    try:
        return create_zone_mapping(
            db,
            zone_id,
            data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get(
    "/{zone_id}/mappings",
    response_model=list[ZoneMappingResponse],
)
def list_mappings_endpoint(
    zone_id: UUID,
    db: Session = Depends(get_db),
):
    return get_zone_mappings(
        db,
        zone_id,
    )


@router.get(
    "/resolve/{pincode}",
    response_model=ZoneResponse,
)
def resolve_zone_endpoint(
    pincode: str,
    db: Session = Depends(get_db),
):
    zone = resolve_zone_by_pincode(
        db,
        pincode,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="No active zone found for this pincode",
        )

    return zone