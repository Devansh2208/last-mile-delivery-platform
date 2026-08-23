Last-Mile Delivery Management System

A full-stack last-mile delivery management platform for managing customers, orders, delivery zones, pricing, delivery agents, order tracking, and role-based operations.

The system provides a RESTful FastAPI backend, PostgreSQL database, JWT-based authentication, and a responsive frontend for customer, delivery-agent, and admin workflows.
## 1. Project Overview

The platform is designed to manage the complete last-mile delivery workflow:

* Customer registration and login
* Role-based access control
* Order creation
* Pickup and delivery zone management
* Pincode-to-zone mapping
* Automatic zone detection
* Volumetric-weight calculation
* Billable-weight calculation
* B2B/B2C rate cards
* Prepaid/COD pricing
* COD surcharge
* Delivery-agent management
* Agent assignment
* Order tracking
* Tracking history
* Admin operations
* Responsive frontend dashboard

The architecture separates the frontend, backend API, database, and business-logic/service layers.

---

# 2. Technology Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* PostgreSQL
* Alembic
* JWT
* `python-jose`
* Passlib / bcrypt

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios / Fetch-based API integration

## Database

* PostgreSQL

## Database Migrations

* Alembic

---

# 3. Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │ React + TypeScript   │
                    └──────────┬───────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌──────────────────────┐
                    │     FastAPI API      │
                    │ Authentication/RBAC  │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
            ┌──────────────┐       ┌──────────────┐
            │   Services   │       │   Schemas    │
            │ Business     │       │ Validation   │
            │ Logic        │       │              │
            └──────┬───────┘       └──────────────┘
                   │
                   ▼
            ┌──────────────┐
            │  SQLAlchemy  │
            │    ORM       │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ PostgreSQL   │
            └──────────────┘
```

---

# 4. Project Structure

```text
last-mile-delivery/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agents.py
│   │   │   ├── auth.py
│   │   │   ├── orders.py
│   │   │   ├── pricing.py
│   │   │   ├── tracking.py
│   │   │   └── zones.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── agent.py
│   │   │   ├── order.py
│   │   │   ├── rate_card.py
│   │   │   ├── tracking.py
│   │   │   ├── user.py
│   │   │   ├── zone.py
│   │   │   └── zone_mapping.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── agent.py
│   │   │   ├── auth.py
│   │   │   ├── order.py
│   │   │   ├── rate_card.py
│   │   │   ├── tracking.py
│   │   │   └── zone.py
│   │   │
│   │   └── services/
│   │       ├── assignment_service.py
│   │       ├── order_service.py
│   │       ├── pricing_service.py
│   │       ├── tracking_service.py
│   │       └── zone_service.py
│   │
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── alembic.ini
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

# 5. Prerequisites

Install:

* Python 3.11+
* Node.js 18+
* npm
* PostgreSQL
* Git

---

# 6. Clone the Repository

```bash
git clone <GITHUB_REPOSITORY_URL>
cd last-mile-delivery
```

---

# 7. Backend Setup

```bash
cd backend
```

Create a virtual environment.

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 8. Backend Environment Variables

Create:

```text
backend/.env
```

Use `.env.example` as the template.

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/last_mile_delivery

JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

ENVIRONMENT=development
```

Never commit the real `.env` file.

---

# 9. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE last_mile_delivery;
```

Update `DATABASE_URL` in `.env`.

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/last_mile_delivery
```

---

# 10. Database Migrations

The project uses Alembic for database schema management.

Apply migrations:

```bash
alembic upgrade head
```

Check migration state:

```bash
alembic current
```

Create a migration after changing SQLAlchemy models:

```bash
alembic revision --autogenerate -m "description"
```

Review the generated migration before applying it:

```bash
alembic upgrade head
```

---

# 11. Start the Backend

From `backend/`:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# 12. Frontend Setup

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The terminal will display the frontend URL.

---

# 13. Production Frontend Build

Build the frontend:

```bash
npm run build
```

The build output should not be committed to the repository.

---

# 14. Authentication and Authorization

The application supports three roles:

```text
CUSTOMER
AGENT
ADMIN
```

Authentication uses JWT access tokens.

## Authentication Flow

```text
Register
   ↓
Login
   ↓
JWT Access Token
   ↓
Authorization: Bearer <token>
   ↓
Protected API
```

Example:

```http
Authorization: Bearer <access_token>
```

The backend validates:

* Token signature
* Token expiration
* User identity
* User role

Role-based authorization is enforced through backend dependencies.

---

# 15. Core API Endpoints

The exact API routes are available through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

Main API groups include:

```text
/api/auth
/orders
/agents
/tracking
/zones
/rate-cards
```

---

# 16. Authentication APIs

## Register

```http
POST /api/auth/register
```

Example:

```json
{
  "name": "Devansh",
  "email": "devansh@example.com",
  "phone": "9876543211",
  "password": "password123",
  "role": "CUSTOMER"
}
```

## Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "devansh@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer"
}
```

---

# 17. Zone Management

Zones determine the geographical pricing and delivery regions.

Main operations:

```text
POST /zones/
GET  /zones/
GET  /zones/{zone_id}

POST /zones/{zone_id}/mappings
GET  /zones/{zone_id}/mappings

GET /zones/resolve/{pincode}
```

A pincode is mapped to a zone using `ZoneMapping`.

During order creation, the delivery pincode is used to resolve the destination zone.

---

# 18. Order Management

Main operations:

```text
POST /orders/
GET  /orders/
GET  /orders/{tracking_number}
```

An order contains:

* Customer information
* Pickup address
* Delivery address
* Delivery pincode
* Pickup zone
* Delivery zone
* Package weight
* Package dimensions
* Volumetric weight
* Billable weight
* Order type
* Payment type
* Calculated charge
* COD surcharge
* Current status

---

# 19. Order Types

Supported order types:

```text
B2B
B2C
```

The applicable rate card is selected using the order type together with the route.

---

# 20. Payment Types

Supported payment types:

```text
PREPAID
COD
```

For COD orders, the configured COD surcharge is applied by the pricing engine.

---

# 21. Rate Calculation Engine

The rate calculation engine follows the required delivery-pricing workflow.

## Step 1 — Zone Detection

The system determines:

```text
Pickup Zone
Delivery Zone
```

The delivery zone is resolved from the delivery pincode and zone mappings.

The pickup zone is associated with the pickup side of the order.

---

## Step 2 — Volumetric Weight

Volumetric weight is calculated using:

```text
Volumetric Weight =
(L × B × H) / 5000
```

where dimensions are in centimeters.

Example:

```text
Length  = 20 cm
Breadth = 20 cm
Height  = 20 cm

Volumetric Weight =
(20 × 20 × 20) / 5000
= 1.6 kg
```

---

## Step 3 — Billable Weight

The system compares:

```text
Actual Weight
Volumetric Weight
```

The higher value becomes the billable weight.

Example:

```text
Actual Weight     = 2.0 kg
Volumetric Weight = 1.6 kg

Billable Weight = 2.0 kg
```

---

## Step 4 — Rate Card Lookup

The applicable active rate card is selected using:

```text
Origin Zone
+
Destination Zone
+
Order Type
```

Rate cards support separate pricing for different routes and B2B/B2C order types.

---

## Step 5 — Shipping Charge

The base shipping charge is calculated as:

```text
Shipping Charge =
Base Rate +
(Billable Weight × Rate Per KG)
```

---

## Step 6 — COD Surcharge

For COD orders:

```text
Total Price =
Shipping Charge +
COD Surcharge
```

For prepaid orders:

```text
Total Price =
Shipping Charge
```

The calculated charge is stored against the order.

---

# 22. Rate Card APIs

Main operations:

```text
POST /rate-cards/
GET  /rate-cards/calculate/{tracking_number}
```

A rate card contains:

```text
Origin Zone
Destination Zone
Order Type
Base Rate
Rate Per KG
COD Surcharge
Active
```

Rates are configured through the database/admin functionality rather than hardcoded into the pricing formula.

---

# 23. Agent Management

Agents contain operational information including:

* Name
* Phone
* Active status
* Availability status

Main operations include:

```text
POST /agents/
GET  /agents/
POST /agents/assign/{tracking_number}
```

Agent availability is used by the assignment workflow.

---

# 24. Order Tracking

Tracking events are stored separately from the order record.

Main operations:

```text
POST /tracking/{tracking_number}
GET  /tracking/{tracking_number}
```

A tracking event can contain:

```text
Status
Location
Description
```

The frontend displays the tracking history as a delivery timeline.

---

# 25. Order Status Lifecycle

The application supports delivery states including:

```text
CREATED
ASSIGNED
PICKED_UP
IN_TRANSIT
OUT_FOR_DELIVERY
DELIVERED
FAILED
RESCHEDULED
CANCELLED
```

The delivery workflow is represented as:

```text
CREATED
   ↓
ASSIGNED
   ↓
PICKED_UP
   ↓
IN_TRANSIT
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Failed deliveries can enter a failed/rescheduling workflow where supported by the backend.

---

# 26. Database Schema

The main entities are:

```text
User
Zone
ZoneMapping
Order
RateCard
Agent
Tracking
```

## User

```text
id
name
email
phone
password_hash
role
created_at
updated_at
```

Roles:

```text
CUSTOMER
AGENT
ADMIN
```

---

## Zone

Stores delivery zones.

A zone can contain multiple pincode mappings.

---

## ZoneMapping

Maps delivery pincodes to zones.

Relationship:

```text
Zone
 │
 └── ZoneMapping
        └── pincode
```

---

## Order

Important fields:

```text
id
tracking_number
customer_name
customer_phone
pickup_address
delivery_address
delivery_pincode
pickup_zone_id
delivery_zone_id
package_weight
length
breadth
height
volumetric_weight
billable_weight
order_type
payment_type
calculated_charge
cod_surcharge
status
created_at
updated_at
```

---

## RateCard

Important fields:

```text
id
origin_zone_id
destination_zone_id
order_type
base_rate
rate_per_kg
cod_surcharge
active
created_at
updated_at
```

---

## Agent

Stores delivery-agent information and availability.

---

## Tracking

Stores tracking events associated with an order.

---

# 27. API Testing

The backend can be tested using:

* FastAPI Swagger UI
* Thunder Client
* Postman

Recommended sequence:

```text
1. Register
2. Login
3. Obtain JWT
4. Create zone
5. Create pincode mapping
6. Create rate card
7. Create order
8. Calculate price
9. Create agent
10. Assign order
11. Add tracking event
12. View tracking history
13. View order
```

---

# 28. Frontend Features

The frontend provides role-specific interfaces.

## Customer

* Register/login
* Dashboard
* Create orders
* View orders
* View order details
* View pricing
* Track deliveries
* View tracking timeline

## Delivery Agent

* Agent dashboard
* Assigned orders
* Delivery status updates
* Tracking updates

## Admin

* Dashboard
* Order management
* Zone management
* Pincode mappings
* Rate-card management
* Agent management
* Agent assignment
* Tracking visibility

---

# 29. Error Handling

The backend uses standard HTTP status codes.

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Validation Error
500 Internal Server Error
```

The frontend displays appropriate loading, error, and empty states for API operations.

---

# 30. Security

The application implements:

* Password hashing
* JWT authentication
* JWT expiration
* Bearer authentication
* Role-based authorization
* Environment-based configuration
* Protected backend endpoints

Sensitive configuration is stored in environment variables.

The actual `.env` file must never be committed.

---

# 31. Environment Files

The repository should contain:

```text
backend/.env.example
frontend/.env.example
```

The repository must not contain:

```text
.env
```

Example backend environment:

```env
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
```

Example frontend environment:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

# 32. Development Workflow

Backend:

```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Database:

```bash
cd backend
alembic upgrade head
```

---

# 33. Production Deployment

The backend can be deployed using services such as:

* Render
* Railway
* AWS
* Similar Python-compatible hosting platforms

The frontend can be deployed using:

* Vercel
* Netlify
* Similar static/frontend hosting platforms

Production deployment requires:

1. PostgreSQL database
2. Backend environment variables
3. Frontend API URL
4. Database migrations
5. Backend deployment
6. Frontend deployment
7. CORS configuration
8. End-to-end production testing

---

# 34. Submission Requirements

The assignment submission requires:

1. Complete source code
2. README
3. `.env.example`
4. API documentation
5. Database schema
6. Rate-calculation logic explanation
7. Hosted application URL
8. System design write-up

The submission guidelines specify that the preferred submission method is a **public GitHub repository on the `main` branch**.

The repository should contain only the necessary project files.

Do not commit:

```text
.env
node_modules/
.venv/
dist/
build/
.next/
.vscode/
.idea/
temporary files
```

---

# 35. Repository Checklist

Before submission:

```text
[ ] Repository is public
[ ] Branch is main
[ ] Backend runs successfully
[ ] Frontend runs successfully
[ ] PostgreSQL configuration documented
[ ] Alembic migrations included
[ ] .env.example included
[ ] Real .env excluded
[ ] node_modules excluded
[ ] .venv excluded
[ ] Build artifacts excluded
[ ] API documentation included
[ ] Database schema documented
[ ] Rate calculation documented
[ ] README updated
[ ] Production build tested
[ ] Hosted URL available
```

---

# 36. Evaluation Focus

The implementation is designed around the major areas specified by the assignment:

* Rate calculation engine
* Zone detection
* Volumetric and billable weight
* B2B/B2C pricing
* COD pricing
* Agent availability and assignment
* Order status lifecycle
* Tracking history
* Database design
* API design
* Code structure
* Documentation

---

# 37. Author

**Devansh Kapoor**

Computer Science
Vellore Institute of Technology, Chennai

---
