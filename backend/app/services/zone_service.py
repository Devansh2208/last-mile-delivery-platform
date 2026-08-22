from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.zone import Zone
from app.models.zone_mapping import ZoneMapping
from app.schemas.zone import ZoneCreate
from app.schemas.zone_mapping import ZoneMappingCreate


# -------------------------
# ZONES
# -------------------------

def create_zone(
    db: Session,
    data: ZoneCreate,
) -> Zone:

    zone = Zone(
        name=data.name,
        code=data.code,
        description=data.description,
    )

    db.add(zone)
    db.commit()
    db.refresh(zone)

    return zone


def get_zones(
    db: Session,
) -> list[Zone]:

    result = db.execute(
        select(Zone).where(Zone.active == True)
    )

    return list(result.scalars().all())


def get_zone(
    db: Session,
    zone_id: UUID,
) -> Zone | None:

    return db.get(Zone, zone_id)


# -------------------------
# ZONE MAPPINGS
# -------------------------

def create_zone_mapping(
    db: Session,
    zone_id: UUID,
    data: ZoneMappingCreate,
) -> ZoneMapping:

    zone = db.get(Zone, zone_id)

    if not zone:
        raise ValueError("Zone not found")

    mapping = ZoneMapping(
        zone_id=zone_id,
        pincode=data.pincode,
    )

    db.add(mapping)
    db.commit()
    db.refresh(mapping)

    return mapping


def get_zone_mappings(
    db: Session,
    zone_id: UUID,
) -> list[ZoneMapping]:

    result = db.execute(
        select(ZoneMapping)
        .where(ZoneMapping.zone_id == zone_id)
    )

    return list(result.scalars().all())


def resolve_zone_by_pincode(
    db: Session,
    pincode: str,
) -> Zone | None:

    result = db.execute(
        select(Zone)
        .join(
            ZoneMapping,
            ZoneMapping.zone_id == Zone.id,
        )
        .where(ZoneMapping.pincode == pincode)
        .where(Zone.active == True)
    )

    return result.scalar_one_or_none()