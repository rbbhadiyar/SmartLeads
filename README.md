# SmartLeads Dashboard

<div align="center">

![SmartLeads](https://img.shields.io/badge/SmartLeads-Dashboard-6366f1?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

**A production-grade, full-stack Lead Management Dashboard built with the MERN stack and TypeScript.**

🌐 **Live Demo:** [smartleadsproject.vercel.app](https://smartleadsproject.vercel.app)  
🔗 **API:** [smartleads-17e5.onrender.com/api](https://smartleads-17e5.onrender.com/api)  
📦 **Repo:** [github.com/rbbhadiyar/SmartLeads](https://github.com/rbbhadiyar/SmartLeads)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-documentation) · [Project Structure](#-project-structure)

</div>

---

## 📌 Overview

SmartLeads is a full-stack Lead Management Dashboard that enables sales teams to track, manage, and convert leads efficiently. It features JWT-based authentication, role-based access control (Admin / Sales), advanced filtering with debounced search, backend pagination, CSV export, and a fully responsive UI with dark mode support.

Built as part of the **ServiceHive Full Stack Internship Assignment** — evaluated on code quality, TypeScript usage, API design, UI/UX, and real-world engineering practices.

---

## ✨ Features

### 🔐 Authentication
- User Registration & Login with JWT
- Password hashing with **bcrypt** (12 salt rounds)
- Protected routes on both frontend and backend
- Auth middleware with token verification
- Input validation on all auth endpoints

### 👥 Role-Based Access Control
| Feature | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Edit own lead | ✅ | ✅ |
| Edit any lead | ✅ | ❌ |
| Delete own lead | ✅ | ✅ |
| Delete any lead | ✅ | ❌ |
| Export CSV | ✅ | ❌ |

### 📋 Lead Management (CRUD)
- Create, Read, Update, Delete leads
- Lead fields: Name, Email, Status, Source, Created At
- Status: `New` · `Contacted` · `Qualified` · `Lost`
- Source: `Website` · `Instagram` · `Referral`
- View single lead details in modal

### 🔍 Advanced Filtering & Search
- Filter by **Status** (New / Contacted / Qualified / Lost)
- Filter by **Source** (Website / Instagram / Referral)
- **Debounced search** by name or email (400ms)
- **Sort** by Latest or Oldest
- All filters work **simultaneously**

### 📄 Pagination
- Backend pagination with `skip` and `limit`
- Default: **10 records per page**
- Pagination metadata in every response (`total`, `page`, `limit`, `totalPages`)

### 📊 Dashboard Stats
- Real-time lead counts via MongoDB aggregation
- Total, Qualified, Contacted, Lost — no over-fetching

### 📥 CSV Export
- One-click export of all leads (Admin only)
- Powered by `json2csv`

### 🌙 Dark Mode
- System-aware dark mode toggle
- Persisted to `localStorage`
- Glassmorphism navbar with `backdrop-filter: blur`

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework with strict typing |
| TailwindCSS v3 | Utility-first styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 + TypeScript | Runtime with strict typing |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database + ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| json2csv | CSV generation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerisation |
| Docker Compose | Multi-service orchestration |
| Nginx | Frontend static file serving + reverse proxy |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

### Option 1 — Local Development

**1. Clone the repository**
```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard
```

**2. Setup Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
npm install
npm run dev
```
Backend runs at `http://localhost:5000`

**3. Setup Frontend**
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

### Option 2 — Docker (Recommended)

Runs MongoDB + Backend + Frontend in one command.

```bash
# 1. Copy root env file
cp .env.example .env

# 2. Set your JWT secret in .env
# JWT_SECRET=your_super_secret_key_here

# 3. Start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api |
| MongoDB | localhost:27017 |

To stop:
```bash
docker-compose down
```

---

## 🔑 Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### Root — `.env` (Docker only)
```env
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## 📁 Project Structure

```
SmartLeads/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Register, Login, GetMe
│   │   │   └── leadController.ts     # CRUD, Stats, CSV Export
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT protect + restrictTo (RBAC)
│   │   │   └── errorHandler.ts       # Centralised error handler
│   │   ├── models/
│   │   │   ├── User.ts               # User schema + bcrypt hook
│   │   │   └── Lead.ts               # Lead schema + text index
│   │   ├── routes/
│   │   │   ├── auth.ts               # /api/auth/*
│   │   │   └── leads.ts              # /api/leads/*
│   │   ├── types/
│   │   │   └── index.ts              # Shared TS interfaces & types
│   │   ├── app.ts                    # Express app + middleware
│   │   └── server.ts                 # MongoDB connect + listen
│   ├── .env.example
│   ├── Dockerfile
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts              # Axios instance + interceptors
│   │   │   ├── auth.ts               # Auth API calls
│   │   │   └── leads.ts              # Leads API calls
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx        # Reusable button variants
│   │   │   │   ├── Input.tsx         # Labelled input with error
│   │   │   │   ├── Modal.tsx         # Accessible modal with ESC
│   │   │   │   ├── Select.tsx        # Labelled select
│   │   │   │   └── StatusBadge.tsx   # Coloured status pill
│   │   │   ├── LeadFiltersBar.tsx    # Search + filter + sort bar
│   │   │   ├── LeadForm.tsx          # Create / Edit lead form
│   │   │   ├── Navbar.tsx            # Glassmorphism sticky navbar
│   │   │   ├── Pagination.tsx        # Page navigation
│   │   │   └── ProtectedRoute.tsx    # Auth guard wrapper
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Global auth state
│   │   │   └── ThemeContext.tsx      # Dark mode state
│   │   ├── hooks/
│   │   │   └── useDebounce.ts        # Generic debounce hook
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx       # Marketing landing page
│   │   │   ├── LoginPage.tsx         # Split-screen login
│   │   │   ├── RegisterPage.tsx      # Split-screen register
│   │   │   └── DashboardPage.tsx     # Main leads dashboard
│   │   ├── types/
│   │   │   └── index.ts              # Shared TS interfaces & types
│   │   ├── utils/
│   │   │   └── formatters.ts         # Date, initials formatters
│   │   └── App.tsx                   # Router + providers
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── tailwind.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

All responses follow this format:
```json
{ "success": true, "data": {}, "message": "optional" }
```

---

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login and get token | No |
| `GET` | `/auth/me` | Get current user | Yes |

**POST `/auth/register`**
```json
{
  "name": "Ram Bhanwar Bhadiyar",
  "email": "ram@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**POST `/auth/login`**
```json
{
  "email": "ram@example.com",
  "password": "secret123"
}
```

**Response (both):**
```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": { "id": "", "name": "", "email": "", "role": "" }
  }
}
```

---

### Leads Endpoints

All routes require: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Role |
|---|---|---|---|
| `GET` | `/leads` | List leads with filters & pagination | All |
| `GET` | `/leads/:id` | Get single lead | All |
| `POST` | `/leads` | Create new lead | All |
| `PUT` | `/leads/:id` | Update lead | Owner / Admin |
| `DELETE` | `/leads/:id` | Delete lead | Owner / Admin |
| `GET` | `/leads/stats` | Get status counts (aggregation) | All |
| `GET` | `/leads/export/csv` | Download leads as CSV | Admin only |

**GET `/leads` — Query Parameters**
```
?status=Qualified
&source=Instagram
&search=Ram
&sort=latest          # latest | oldest
&page=1
&limit=10
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [ ...leads ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Lead Object:**
```json
{
  "_id": "64f...",
  "name": "Ram Bhanwar Bhadiyar",
  "email": "ram@example.com",
  "status": "Qualified",
  "source": "Website",
  "createdBy": { "name": "Admin User", "email": "admin@example.com" },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**GET `/leads/stats` Response:**
```json
{
  "success": true,
  "data": { "total": 24, "New": 8, "Contacted": 6, "Qualified": 7, "Lost": 3 }
}
```

---

## 🧪 Testing the API

You can test the API using **Postman** or **curl**:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ram Bhanwar Bhadiyar","email":"ram@example.com","password":"secret123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ram@example.com","password":"secret123"}'

# Get leads (replace TOKEN)
curl http://localhost:5000/api/leads \
  -H "Authorization: Bearer TOKEN"

# Filter leads
curl "http://localhost:5000/api/leads?status=Qualified&source=Website&sort=latest&page=1" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🏗 Architecture Decisions

- **Strict TypeScript** — No `any` usage. All interfaces defined in `src/types/index.ts` for both frontend and backend.
- **Centralised error handling** — `AppError` class + Express error middleware. All errors flow through one handler.
- **RBAC on backend** — Role checks happen in middleware/controller, never trusted from frontend.
- **Debounced search** — Generic `useDebounce<T>` hook prevents excessive API calls.
- **MongoDB aggregation for stats** — Uses `$group` pipeline instead of fetching all documents.
- **Secure update** — `updateLead` only allows specific fields (`name`, `email`, `status`, `source`), never `createdBy`.
- **Docker multi-stage build** — Frontend uses Nginx with a multi-stage Dockerfile to keep image size minimal.

---

## 📜 Scripts

### Backend
```bash
npm run dev      # Start dev server with ts-node-dev (hot reload)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled dist/server.js
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check + build for production
npm run preview  # Preview production build locally
```

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt (12 rounds) — never stored in plain text
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- CORS is restricted to configured `CLIENT_URL`
- All lead mutations verify ownership or admin role on the **backend**
- Environment variables are never committed (`.env` is in `.gitignore`)

---

## 📄 License

MIT — feel free to use this project for learning and reference.

---

<div align="center">
  Built with ❤️ using React · TypeScript · Node.js · MongoDB
</div>
