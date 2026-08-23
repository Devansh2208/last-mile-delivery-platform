"""upgrade orders and pricing

Revision ID: a5b41b85017d
Revises: ff9c27410095
Create Date: 2026-08-23

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a5b41b85017d"
down_revision: Union[str, Sequence[str], None] = "ff9c27410095"
branch_labels = None
depends_on = None


def upgrade() -> None:

    # ============================================================
    # ORDERS
    # ============================================================

    # Add new columns as nullable first
    op.add_column(
        "orders",
        sa.Column(
            "pickup_zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "delivery_zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "length",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "breadth",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "height",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "volumetric_weight",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "billable_weight",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )

    # Create enum types
    order_type_enum = sa.Enum(
        "B2B",
        "B2C",
        name="ordertype",
    )

    payment_type_enum = sa.Enum(
        "PREPAID",
        "COD",
        name="paymenttype",
    )

    order_type_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    payment_type_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    op.add_column(
        "orders",
        sa.Column(
            "order_type",
            order_type_enum,
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "payment_type",
            payment_type_enum,
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "calculated_charge",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "cod_surcharge",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )

    # ============================================================
    # MIGRATE EXISTING ORDER DATA
    # ============================================================

    # Existing orders used the old `zone_id`.
    # Use that zone as the delivery zone.
    op.execute(
        """
        UPDATE orders
        SET delivery_zone_id = zone_id
        WHERE delivery_zone_id IS NULL
        """
    )

    # Existing orders don't have dimensions.
    # Give them safe development defaults.
    op.execute(
        """
        UPDATE orders
        SET
            length = 1,
            breadth = 1,
            height = 1
        WHERE
            length IS NULL
            OR breadth IS NULL
            OR height IS NULL
        """
    )

    # Calculate volumetric weight for old records.
    op.execute(
        """
        UPDATE orders
        SET volumetric_weight =
            (length * breadth * height)::numeric / 5000
        WHERE volumetric_weight IS NULL
        """
    )

    # Existing actual weight is grams.
    op.execute(
        """
        UPDATE orders
        SET billable_weight =
            GREATEST(
                package_weight::numeric / 1000,
                volumetric_weight
            )
        WHERE billable_weight IS NULL
        """
    )

    # Existing orders default to B2C + PREPAID.
    op.execute(
        """
        UPDATE orders
        SET order_type = 'B2C'
        WHERE order_type IS NULL
        """
    )

    op.execute(
        """
        UPDATE orders
        SET payment_type = 'PREPAID'
        WHERE payment_type IS NULL
        """
    )

    op.execute(
        """
        UPDATE orders
        SET cod_surcharge = 0
        WHERE cod_surcharge IS NULL
        """
    )

    # Existing zone becomes pickup zone too.
    op.execute(
        """
        UPDATE orders
        SET pickup_zone_id = zone_id
        WHERE pickup_zone_id IS NULL
        """
    )

    # ============================================================
    # REMOVE OLD ORDER ZONE
    # ============================================================

    op.drop_index(
        op.f("ix_orders_zone_id"),
        table_name="orders",
    )

    op.drop_constraint(
        op.f("orders_zone_id_fkey"),
        "orders",
        type_="foreignkey",
    )

    op.drop_column(
        "orders",
        "zone_id",
    )

    # ============================================================
    # RATE CARDS
    # ============================================================

    op.add_column(
        "rate_cards",
        sa.Column(
            "origin_zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.add_column(
        "rate_cards",
        sa.Column(
            "destination_zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.add_column(
        "rate_cards",
        sa.Column(
            "order_type",
            sa.String(10),
            nullable=True,
        ),
    )

    op.add_column(
        "rate_cards",
        sa.Column(
            "cod_surcharge",
            sa.Integer(),
            nullable=True,
        ),
    )

    # ============================================================
    # MIGRATE EXISTING RATE CARDS
    # ============================================================

    # Existing rate cards only had one zone.
    # Treat it as both origin and destination.
    op.execute(
        """
        UPDATE rate_cards
        SET
            origin_zone_id = zone_id,
            destination_zone_id = zone_id
        WHERE
            origin_zone_id IS NULL
            OR destination_zone_id IS NULL
        """
    )

    # Existing rate cards default to B2C.
    op.execute(
        """
        UPDATE rate_cards
        SET order_type = 'B2C'
        WHERE order_type IS NULL
        """
    )

    op.execute(
        """
        UPDATE rate_cards
        SET cod_surcharge = 0
        WHERE cod_surcharge IS NULL
        """
    )

    # ============================================================
    # REMOVE OLD RATE CARD ZONE
    # ============================================================

    op.drop_index(
        op.f("ix_rate_cards_zone_id"),
        table_name="rate_cards",
    )

    op.drop_constraint(
        op.f("rate_cards_zone_id_fkey"),
        "rate_cards",
        type_="foreignkey",
    )

    op.drop_column(
        "rate_cards",
        "zone_id",
    )

    # ============================================================
    # FOREIGN KEYS
    # ============================================================

    op.create_foreign_key(
        "orders_pickup_zone_id_fkey",
        "orders",
        "zones",
        ["pickup_zone_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "orders_delivery_zone_id_fkey",
        "orders",
        "zones",
        ["delivery_zone_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "rate_cards_origin_zone_id_fkey",
        "rate_cards",
        "zones",
        ["origin_zone_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "rate_cards_destination_zone_id_fkey",
        "rate_cards",
        "zones",
        ["destination_zone_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # ============================================================
    # INDEXES
    # ============================================================

    op.create_index(
        op.f("ix_orders_pickup_zone_id"),
        "orders",
        ["pickup_zone_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_orders_delivery_zone_id"),
        "orders",
        ["delivery_zone_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_rate_cards_origin_zone_id"),
        "rate_cards",
        ["origin_zone_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_rate_cards_destination_zone_id"),
        "rate_cards",
        ["destination_zone_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_rate_cards_order_type"),
        "rate_cards",
        ["order_type"],
        unique=False,
    )

    # ============================================================
    # MAKE REQUIRED FIELDS NON-NULL
    # ============================================================

    op.alter_column(
        "orders",
        "length",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "breadth",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "height",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "volumetric_weight",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "billable_weight",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "order_type",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "payment_type",
        nullable=False,
    )

    op.alter_column(
        "orders",
        "cod_surcharge",
        nullable=False,
    )

    op.alter_column(
        "rate_cards",
        "origin_zone_id",
        nullable=False,
    )

    op.alter_column(
        "rate_cards",
        "destination_zone_id",
        nullable=False,
    )

    op.alter_column(
        "rate_cards",
        "order_type",
        nullable=False,
    )

    op.alter_column(
        "rate_cards",
        "cod_surcharge",
        nullable=False,
    )


def downgrade() -> None:

    # For this development migration, downgrade is intentionally
    # conservative because existing data has been transformed.

    op.drop_index(
        op.f("ix_rate_cards_order_type"),
        table_name="rate_cards",
    )

    op.drop_index(
        op.f("ix_rate_cards_destination_zone_id"),
        table_name="rate_cards",
    )

    op.drop_index(
        op.f("ix_rate_cards_origin_zone_id"),
        table_name="rate_cards",
    )

    op.drop_index(
        op.f("ix_orders_delivery_zone_id"),
        table_name="orders",
    )

    op.drop_index(
        op.f("ix_orders_pickup_zone_id"),
        table_name="orders",
    )

    op.drop_constraint(
        "rate_cards_origin_zone_id_fkey",
        "rate_cards",
        type_="foreignkey",
    )

    op.drop_constraint(
        "rate_cards_destination_zone_id_fkey",
        "rate_cards",
        type_="foreignkey",
    )

    op.drop_constraint(
        "orders_pickup_zone_id_fkey",
        "orders",
        type_="foreignkey",
    )

    op.drop_constraint(
        "orders_delivery_zone_id_fkey",
        "orders",
        type_="foreignkey",
    )

    op.add_column(
        "orders",
        sa.Column(
            "zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE orders
        SET zone_id = delivery_zone_id
        """
    )

    op.create_foreign_key(
        "orders_zone_id_fkey",
        "orders",
        "zones",
        ["zone_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_index(
        op.f("ix_orders_zone_id"),
        "orders",
        ["zone_id"],
        unique=False,
    )

    op.add_column(
        "rate_cards",
        sa.Column(
            "zone_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE rate_cards
        SET zone_id = destination_zone_id
        """
    )

    op.create_foreign_key(
        "rate_cards_zone_id_fkey",
        "rate_cards",
        "zones",
        ["zone_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_index(
        op.f("ix_rate_cards_zone_id"),
        "rate_cards",
        ["zone_id"],
        unique=False,
    )

    op.drop_column("rate_cards", "cod_surcharge")
    op.drop_column("rate_cards", "order_type")
    op.drop_column("rate_cards", "destination_zone_id")
    op.drop_column("rate_cards", "origin_zone_id")

    op.drop_column("orders", "cod_surcharge")
    op.drop_column("orders", "calculated_charge")
    op.drop_column("orders", "payment_type")
    op.drop_column("orders", "order_type")
    op.drop_column("orders", "billable_weight")
    op.drop_column("orders", "volumetric_weight")
    op.drop_column("orders", "height")
    op.drop_column("orders", "breadth")
    op.drop_column("orders", "length")
    op.drop_column("orders", "delivery_zone_id")
    op.drop_column("orders", "pickup_zone_id")

    sa.Enum(
        "B2B",
        "B2C",
        name="ordertype",
    ).drop(
        op.get_bind(),
        checkfirst=True,
    )

    sa.Enum(
        "PREPAID",
        "COD",
        name="paymenttype",
    ).drop(
        op.get_bind(),
        checkfirst=True,
    )