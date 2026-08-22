# Last-Mile Delivery Management Platform

A backend API for managing last-mile delivery operations, including users, authentication, zones, orders, delivery agents, order assignment, tracking events, rate cards, and dynamic delivery pricing.

## Overview

The Last-Mile Delivery Management Platform provides REST APIs for managing the complete lifecycle of a delivery order.

The platform supports:

- User registration and login
- JWT-based authentication
- Role-based authorization
- Delivery zone management
- Pincode-to-zone mapping
- Order creation and retrieval
- Delivery agent management
- Agent assignment to orders
- Shipment tracking events
- Rate card management
- Dynamic order price calculation
- PostgreSQL database persistence
- Database migrations using Alembic

---

## Features

### Authentication & Authorization

The application provides secure authentication using:

- Password hashing with bcrypt
- JWT access tokens
- Token-based authentication
- Role-based authorization

Supported user roles:

| Role | Description |
|------|-------------|
| `CUSTOMER` | Customer-level access |
| `AGENT` | Delivery agent operations |
| `ADMIN` | Administrative operations |

Protected endpoints require a valid Bearer token.

Example:

```http
Authorization: Bearer <access_token>
Zone Management

Zones are used to organize delivery areas.

Supported operations include:

Create a zone
List zones
Retrieve a zone
Create pincode mappings
List zone mappings
Resolve a zone using a pincode

Example zone:

{
  "name": "Chennai Central",
  "code": "CHN-CENTRAL",
  "description": "Central Chennai delivery zone",
  "active": true
}
Order Management

Orders contain customer, pickup, delivery, package, and zone information.

Supported operations:

Create an order
List orders
Retrieve an individual order using its tracking number

Example order:

{
  "customer_name": "Devansh",
  "customer_phone": "9876543210",
  "pickup_address": "Chennai Warehouse",
  "delivery_address": "Chennai Central",
  "delivery_pincode": "600001",
  "zone_id": "<zone_uuid>",
  "package_weight": 1500
}

package_weight is stored in grams.

Orders receive a unique tracking number such as:

LM-B205D28181
Delivery Agent Management

The platform supports delivery agent management and order assignment.

Supported operations:

Create delivery agents
List delivery agents
Assign orders to available agents

Example agent:

{
  "name": "Ravi Kumar",
  "phone": "9876501234"
}

Agents maintain availability information so orders can be assigned to available delivery personnel.

Order Tracking

Tracking events provide a history of an order's delivery status.

A tracking event can contain:

Status
Location
Description
Timestamp
Associated order

Example:

{
  "status": "PICKED_UP",
  "location": "Chennai Warehouse",
  "description": "Package picked up from warehouse"
}

Tracking history can be retrieved using the order's tracking number.

Rate Cards & Pricing

Rate cards define delivery pricing for individual zones.

Each rate card contains:

Zone
Base rate
Rate per kilogram
Active status

Example:

{
  "zone_id": "<zone_uuid>",
  "base_rate": 50,
  "rate_per_kg": 20
}
Price Calculation

The delivery price is calculated using:

Total Price = Base Rate + (Package Weight in KG × Rate Per KG)

For example:

Package weight = 1500 grams
Package weight = 1.5 KG

Base rate = ₹50
Rate per KG = ₹20

Total price = 50 + (1.5 × 20)
            = ₹80
Technology Stack
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Pydantic Settings
Database
PostgreSQL
Alembic for database migrations
Authentication
JWT
python-jose
Passlib / bcrypt
Development
Uvicorn
REST API
Swagger / OpenAPI documentation
Project Structure
last-mile-delivery/
│
├── app/
│   ├── api/
│   │   ├── agents.py
│   │   ├── auth.py
│   │   ├── orders.py
│   │   ├── rate_cards.py
│   │   ├── tracking.py
│   │   └── zones.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   │
│   ├── db/
│   │   ├── base.py
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── agent.py
│   │   ├── order.py
│   │   ├── rate_card.py
│   │   ├── tracking.py
│   │   ├── user.py
│   │   ├── zone.py
│   │   └── zone_mapping.py
│   │
│   ├── schemas/
│   │   ├── agent.py
│   │   ├── auth.py
│   │   ├── order.py
│   │   ├── rate_card.py
│   │   ├── tracking.py
│   │   ├── zone.py
│   │   └── zone_mapping.py
│   │
│   ├── services/
│   │   ├── assignment_service.py
│   │   ├── order_service.py
│   │   ├── pricing_service.py
│   │   ├── tracking_service.py
│   │   └── zone_service.py
│   │
│   └── main.py
│
├── alembic/
│   ├── versions/
│   └── env.py
│
├── alembic.ini
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
Prerequisites

Make sure the following are installed:

Python 3.10+
PostgreSQL
Git
Installation
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd last-mile-delivery/backend
2. Create a virtual environment
Windows
python -m venv .venv
.venv\Scripts\activate
Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
3. Install dependencies
pip install -r requirements.txt
Environment Configuration

Create a .env file in the backend root.

Use .env.example as a reference.

Example:

DATABASE_URL=postgresql://postgres:password@localhost:5432/last_mile_delivery

JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
Important

Do not commit the .env file to GitHub.

The repository should contain .env.example instead.

Database Setup

Create the PostgreSQL database before running the application.

Then run the Alembic migrations:

alembic upgrade head

To generate a migration after changing SQLAlchemy models:

alembic revision --autogenerate -m "describe your change"

Then apply it:

alembic upgrade head
Running the Application

Start the FastAPI development server:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000
API Documentation

FastAPI automatically provides interactive API documentation.

Swagger UI
http://127.0.0.1:8000/docs
ReDoc
http://127.0.0.1:8000/redoc
Main API Endpoints
Health
Check application health
GET /health
Authentication
Register
POST /api/auth/register

Example:

{
  "name": "Devansh",
  "email": "devansh@example.com",
  "phone": "9876543210",
  "password": "Password123"
}
Login
POST /api/auth/login

Example:

{
  "email": "devansh@example.com",
  "password": "Password123"
}

Response:

{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}

Use the returned token for protected endpoints:

Authorization: Bearer <jwt_token>
Zones
POST /zones/
GET /zones/
GET /zones/{zone_id}
POST /zones/{zone_id}/mappings
GET /zones/{zone_id}/mappings
GET /zones/resolve/{pincode}
Orders
POST /orders/
GET /orders/
GET /orders/{tracking_number}
Agents
POST /agents/
GET /agents/
POST /agents/assign/{tracking_number}
Tracking
POST /tracking/{tracking_number}
GET /tracking/{tracking_number}
Rate Cards
POST /rate-cards/
GET /rate-cards/calculate/{tracking_number}
Authentication Flow

The authentication flow is:

Register
   │
   ▼
User stored in PostgreSQL
   │
   ▼
Login
   │
   ▼
Password verification
   │
   ▼
JWT access token generated
   │
   ▼
Client sends Bearer token
   │
   ▼
JWT validation
   │
   ▼
Current user identified
   │
   ▼
Role checked
   │
   ▼
Protected endpoint executed
Authorization

Role-based access control is implemented using user roles.

A protected operation can restrict access to specific roles.

For example:

CUSTOMER
   │
   ├── Authentication
   └── Customer-level operations

AGENT
   │
   ├── Authentication
   └── Delivery/tracking operations

ADMIN
   │
   ├── Administrative operations
   ├── Agent management
   ├── Rate card management
   └── Other restricted operations

Requests made without a valid token return:

401 Unauthorized

Requests made with a valid token but insufficient permissions return:

403 Forbidden
Example Delivery Flow

A typical delivery workflow is:

1. Register / Login
        │
        ▼
2. Create Delivery Zone
        │
        ▼
3. Map Pincode to Zone
        │
        ▼
4. Create Rate Card
        │
        ▼
5. Create Order
        │
        ▼
6. Assign Order to Agent
        │
        ▼
7. Add Tracking Events
        │
        ▼
8. Retrieve Tracking History
        │
        ▼
9. Calculate Delivery Price
Error Handling

The API uses standard HTTP status codes.

Status	Meaning
200	Successful request
201	Resource created
400	Invalid request / business rule failure
401	Authentication required or invalid
403	Insufficient permissions
404	Resource not found
422	Request validation failed
500	Internal server error
Database Migrations

Alembic is used to manage schema changes.

Check migration status:

alembic current

Upgrade to the latest migration:

alembic upgrade head

Create a new migration:

alembic revision --autogenerate -m "migration description"
Testing

The API can be tested using:

Swagger UI
Thunder Client
Postman
Any REST API client

Recommended testing order:

Health
   ↓
Register
   ↓
Login
   ↓
Authenticate with JWT
   ↓
Create Zone
   ↓
Create Zone Mapping
   ↓
Create Rate Card
   ↓
Create Order
   ↓
Create Agent
   ↓
Assign Order
   ↓
Add Tracking Event
   ↓
Retrieve Tracking History
   ↓
Calculate Price

Authentication and authorization should also be tested by verifying:

No token       → 401 Unauthorized
Wrong role     → 403 Forbidden
Correct role   → Request succeeds
Security & Repository Guidelines

The project follows these repository practices:

Sensitive .env files are not committed.
Environment variables are documented through .env.example.
Virtual environments are excluded from version control.
Temporary and editor-specific files are excluded.
Secrets should be supplied through environment variables.
JWT secrets should never be committed to the repository.
Future Improvements

Potential future improvements include:

Automated unit and integration tests
Pagination for large datasets
More detailed order status transitions
Advanced agent assignment strategies
Delivery performance analytics
API rate limiting
Production deployment configuration
Containerization and CI/CD