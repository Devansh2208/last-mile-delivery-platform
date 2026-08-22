from fastapi import APIRouter

router = APIRouter()


@router.get("/stats")
def admin_stats():
    return {"stats": {}}
