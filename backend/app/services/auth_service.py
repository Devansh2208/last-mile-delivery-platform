from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest
from app.core.security import (
    hash_password,
    verify_password,
)


def register_user(
    db: Session,
    data: RegisterRequest,
):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise ValueError("Email already registered")

    if data.phone:
        existing_phone = db.query(User).filter(
            User.phone == data.phone
        ).first()

        if existing_phone:
            raise ValueError("Phone already registered")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role=UserRole.CUSTOMER,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user