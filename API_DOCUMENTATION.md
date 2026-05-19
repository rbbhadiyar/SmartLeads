# SmartLeads API Documentation

**Version:** 1.0.0  
**Base URL (Production):** `https://smartleads-17e5.onrender.com/api`  
**Base URL (Local):** `http://localhost:5000/api`

---

## Overview

The SmartLeads REST API is built with Node.js, Express.js, and TypeScript. All endpoints return JSON. Authentication is handled via JSON Web Tokens (JWT) passed in the `Authorization` header.

### Response Format

Every response follows a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "message": "optional string",
  "meta": {}
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded |
| `201` | Created — resource created |
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found — resource does not exist |
| `500` | Internal Server Error |

---

## Authentication

All protected endpoints require a Bearer token in the request header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from the `/auth/login` or `/auth/register` endpoints and expire in **7 days**.

---

## Endpoints

### Auth

---

#### POST `/auth/register`

Register a new user account.

**Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Minimum 6 characters |
| `role` | string | No | `admin` or `sales` (default: `sales`) |

**Example Request:**
```json
{
  "name": "Ram Bhanwar Bhadiyar",
  "email": "ram@example.com",
  "password": "secret123",
  "role": "admin"
}
```

**Example Response — 201 Created:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Ram Bhanwar Bhadiyar",
      "email": "ram@example.com",
      "role": "admin"
    }
  }
}
```

**Error Responses:**
```json
{ "success": false, "message": "Email already in use" }
{ "success": false, "message": "Password must be at least 6 characters" }
```

---

#### POST `/auth/login`

Authenticate an existing user and receive a JWT token.

**Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

**Example Request:**
```json
{
  "email": "ram@example.com",
  "password": "secret123"
}
```

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Ram Bhanwar Bhadiyar",
      "email": "ram@example.com",
      "role": "admin"
    }
  }
}
```

**Error Responses:**
```json
{ "success": false, "message": "Invalid credentials" }
```

---

#### GET `/auth/me`

Get the currently authenticated user's profile.

**Auth Required:** Yes

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ram Bhanwar Bhadiyar",
    "email": "ram@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Leads

All leads endpoints require authentication: `Authorization: Bearer <token>`

---

#### GET `/leads`

Retrieve a paginated list of leads with optional filters.

**Auth Required:** Yes  
**Role:** All

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |
| `sort` | string | `latest` | `latest` or `oldest` |
| `status` | string | — | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | — | `Website`, `Instagram`, `Referral` |
| `search` | string | — | Search by name or email (case-insensitive) |

All filters can be combined simultaneously.

**Example Request:**
```
GET /api/leads?status=Qualified&source=Instagram&search=Ram&sort=latest&page=1&limit=10
```

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Ram Bhanwar Bhadiyar",
      "email": "ram@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": {
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### GET `/leads/:id`

Retrieve a single lead by ID.

**Auth Required:** Yes  
**Role:** All

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the lead |

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ram Bhanwar Bhadiyar",
    "email": "ram@example.com",
    "status": "Qualified",
    "source": "Website",
    "createdBy": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
{ "success": false, "message": "Lead not found" }
```

---

#### POST `/leads`

Create a new lead.

**Auth Required:** Yes  
**Role:** All

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Lead's full name |
| `email` | string | Yes | Lead's email address |
| `status` | string | No | `New`, `Contacted`, `Qualified`, `Lost` (default: `New`) |
| `source` | string | Yes | `Website`, `Instagram`, `Referral` |

**Example Request:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "status": "New",
  "source": "Website"
}
```

**Example Response — 201 Created:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "status": "New",
    "source": "Website",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### PUT `/leads/:id`

Update an existing lead. Only the owner or an Admin can update a lead.

**Auth Required:** Yes  
**Role:** Owner or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the lead |

**Request Body** (all fields optional):

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Updated name |
| `email` | string | Updated email |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |

**Example Request:**
```json
{
  "status": "Qualified",
  "source": "Referral"
}
```

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "status": "Qualified",
    "source": "Referral",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Responses:**
```json
{ "success": false, "message": "Lead not found" }
{ "success": false, "message": "Not authorized to update this lead" }
```

---

#### DELETE `/leads/:id`

Delete a lead. Only the owner or an Admin can delete a lead.

**Auth Required:** Yes  
**Role:** Owner or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the lead |

**Example Response — 200 OK:**
```json
{
  "success": true,
  "message": "Lead deleted"
}
```

**Error Responses:**
```json
{ "success": false, "message": "Lead not found" }
{ "success": false, "message": "Not authorized to delete this lead" }
```

---

#### GET `/leads/stats`

Get aggregated lead counts grouped by status. Uses MongoDB `$group` aggregation pipeline.

**Auth Required:** Yes  
**Role:** All

**Example Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "total": 24,
    "New": 8,
    "Contacted": 6,
    "Qualified": 7,
    "Lost": 3
  }
}
```

---

#### GET `/leads/export/csv`

Export all leads as a downloadable CSV file.

**Auth Required:** Yes  
**Role:** Admin only

**Response:** `Content-Type: text/csv` file download named `leads.csv`

**CSV Columns:** `name`, `email`, `status`, `source`, `createdAt`

**Error Responses:**
```json
{ "success": false, "message": "Access denied" }
```

---

## Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | string | Full name |
| `email` | string | Unique email (lowercase) |
| `password` | string | bcrypt hashed (12 rounds) |
| `role` | string | `admin` or `sales` |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

### Lead

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | string | Lead's full name |
| `email` | string | Lead's email (lowercase) |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |
| `createdBy` | ObjectId | Reference to User |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

---

## Role-Based Access Control

| Endpoint | Admin | Sales |
|----------|-------|-------|
| GET `/leads` | ✅ | ✅ |
| GET `/leads/:id` | ✅ | ✅ |
| POST `/leads` | ✅ | ✅ |
| PUT `/leads/:id` (own) | ✅ | ✅ |
| PUT `/leads/:id` (any) | ✅ | ❌ |
| DELETE `/leads/:id` (own) | ✅ | ✅ |
| DELETE `/leads/:id` (any) | ✅ | ❌ |
| GET `/leads/stats` | ✅ | ✅ |
| GET `/leads/export/csv` | ✅ | ❌ |

---

## Rate Limiting

No rate limiting is applied in the current version.

---

## Testing

Use the live API at `https://smartleads-17e5.onrender.com/api` or run locally.

**Quick test with curl:**

```bash
# 1. Register
curl -X POST https://smartleads-17e5.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"admin"}'

# 2. Login — copy the token from response
curl -X POST https://smartleads-17e5.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 3. Get leads (replace TOKEN)
curl https://smartleads-17e5.onrender.com/api/leads \
  -H "Authorization: Bearer TOKEN"

# 4. Create a lead
curl -X POST https://smartleads-17e5.onrender.com/api/leads \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Sharma","email":"priya@example.com","source":"Website"}'

# 5. Filter leads
curl "https://smartleads-17e5.onrender.com/api/leads?status=New&sort=latest&page=1" \
  -H "Authorization: Bearer TOKEN"

# 6. Export CSV (admin only)
curl https://smartleads-17e5.onrender.com/api/leads/export/csv \
  -H "Authorization: Bearer TOKEN" \
  -o leads.csv
```
