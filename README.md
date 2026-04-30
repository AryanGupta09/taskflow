# TaskFlow — Team Task Manager

A full-stack **MERN** application for managing team projects and tasks with role-based access control, a Kanban board, dashboard analytics, and a polished modern UI.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Role-Based Access Control](#role-based-access-control)
- [Demo Credentials](#demo-credentials)
- [Postman Collection](#postman-collection)
- [Scripts](#scripts)

---

## Overview

TaskFlow is a production-ready team task management system built on the MERN stack. It supports two user roles — **Admin** and **Member** — with different levels of access across projects, tasks, and user management.

```
┌─────────────────────────────────────────────────────┐
│                    TaskFlow                         │
│                                                     │
│   React 18 + Vite  ──►  Express.js API  ──►  MongoDB│
│   TailwindCSS           JWT Auth            Mongoose│
│   Recharts              bcryptjs                    │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express.js | ^4.19 | Web framework |
| Mongoose | ^8.4 | MongoDB ODM |
| bcryptjs | ^2.4 | Password hashing (salt 12) |
| jsonwebtoken | ^9.0 | JWT access tokens |
| express-validator | ^7.1 | Request validation |
| cors | ^2.8 | Cross-origin requests |
| dotenv | ^16.4 | Environment variables |
| morgan | ^1.10 | HTTP request logging |
| nodemon | ^3.1 | Dev auto-restart |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | ^19.2 | UI library |
| Vite | ^8.0 | Build tool & dev server |
| React Router DOM | ^7.14 | Client-side routing |
| Axios | ^1.15 | HTTP client with interceptors |
| TailwindCSS | ^3.4 | Utility-first CSS |
| Recharts | ^3.8 | Dashboard charts |
| React Hot Toast | ^2.6 | Toast notifications |
| React Icons | ^5.6 | Icon library (Feather set) |
| date-fns | ^4.1 | Date formatting utilities |

---

## Features

### Authentication
- JWT-based login and registration
- Passwords hashed with bcryptjs (salt rounds: 12)
- Token stored in `localStorage`, auto-attached via Axios request interceptor
- Auto-logout on 401 response
- Show/hide password toggle on login & register
- Password strength indicator on register (Weak / Medium / Strong)
- One-click demo credential fill on login page

### Dashboard
- Personalized greeting (morning / afternoon / evening)
- 4 stat cards: Total Tasks, Completed, In Progress, Overdue
- Overall progress bar with percentage
- Task Status Distribution — Recharts **PieChart** (donut)
- Priority Breakdown — Recharts **BarChart**
- Recent Tasks table (last 5, with assignee, status, due date)

### Projects
- Grid view with status filter (Active / Completed / Archived)
- Coloured top-accent bar per project status
- Stacked member avatar row on each card
- Task count, member count, deadline per card
- Create / Edit / Delete (admin only)
- Pagination (9 per page)

### Project Detail
- Full project header: name, status badge, owner, deadline, task count
- Member management: add / remove members (admin only)
- **Kanban Board** — 3 columns (Todo / In Progress / Completed) with per-column task counts and Add Task button
- **List View** — sortable table with inline status dropdown
- Tab toggle between Kanban and List views

### Tasks
- Grid view and List view toggle
- Filter bar: Status, Priority, Project, Assignee (admin only)
- Create / Edit / Delete (admin only)
- Members can only update task **status**
- Priority colour-coded left border on task cards (red = high, amber = medium, green = low)
- Overdue warning pill on cards
- Pagination (10 per page)

### Users (Admin only)
- Search by name or email
- Role badge (Admin / Member) with shield icon
- Promote to Admin / Demote to Member toggle
- Delete user with confirmation dialog
- Cannot delete or demote yourself

### UI / UX
- Dark sidebar (`bg-gray-950`) with gradient active nav states
- Violet/indigo gradient design system
- Responsive — sidebar collapses to hamburger on mobile
- Smooth hover lift on all cards (`hover:-translate-y-0.5`)
- Modal with backdrop blur, ESC to close, scroll lock
- Skeleton loading cards
- Empty states with contextual icons
- All destructive actions require a confirmation dialog

---

## Project Structure

```
TaskFlow/
├── backend/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      ← register, login, getMe, logout
│   │   ├── projectController.js   ← CRUD + member management
│   │   ├── taskController.js      ← CRUD + dashboard stats
│   │   └── userController.js      ← admin user management
│   ├── middleware/
│   │   ├── authMiddleware.js      ← protect (JWT) + restrictTo (RBAC)
│   │   ├── errorMiddleware.js     ← global error handler + 404
│   │   └── validateMiddleware.js  ← express-validator formatter
│   ├── models/
│   │   ├── User.js                ← bcrypt pre-save, comparePassword, generateJWT
│   │   ├── Project.js             ← cascade-delete tasks on project delete
│   │   └── Task.js                ← compound indexes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── AppError.js            ← custom operational error class
│   ├── .env.example
│   ├── postman_collection.json    ← ready-to-import Postman collection
│   ├── seed.js                    ← seed script (3 users, 2 projects, 5 tasks)
│   ├── server.js                  ← Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           ← Axios instance + interceptors
    │   ├── context/
    │   │   ├── AuthContext.jsx    ← auth state (user, token, login, logout)
    │   │   └── TaskContext.jsx    ← global tasks/projects/users state
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useProjects.js
    │   │   └── useTasks.js
    │   ├── components/
    │   │   ├── common/            ← Button, Input, Modal, Badge, Loader,
    │   │   │                         EmptyState, ConfirmDialog, ProtectedRoute
    │   │   ├── layout/            ← Sidebar, Navbar, Layout
    │   │   ├── dashboard/         ← StatsCard, TaskStatusChart, PriorityChart,
    │   │   │                         RecentTasks
    │   │   ├── projects/          ← ProjectCard, ProjectForm, MembersList
    │   │   └── tasks/             ← TaskCard, TaskForm, TaskFilters, KanbanBoard
    │   ├── pages/
    │   │   ├── auth/              ← Login, Register
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Users.jsx
    │   │   └── NotFound.jsx
    │   ├── utils/
    │   │   ├── constants.js       ← STATUS/PRIORITY enums + color maps
    │   │   └── helpers.js         ← formatDate, isOverdue, getInitials, etc.
    │   ├── App.jsx                ← routing (public + protected routes)
    │   └── main.jsx
    ├── .env.example
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone & install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env if your backend runs on a different port
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin user
- 2 Member users
- 2 sample projects with members
- 5 sample tasks across both projects

### 4. Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | — | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `NODE_ENV` | `development` | Environment mode |

### Frontend — `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT + user |
| GET | `/me` | Protected | Get current user |
| POST | `/logout` | Protected | Logout (client-side) |

### Projects — `/api/projects`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Protected | List projects (admin: all, member: own) |
| POST | `/` | Admin | Create project |
| GET | `/:id` | Protected | Get project with members + task count |
| PATCH | `/:id` | Admin / Owner | Update project |
| DELETE | `/:id` | Admin | Delete project + all its tasks |
| POST | `/:id/members` | Admin | Add member `{ userId }` |
| DELETE | `/:id/members/:userId` | Admin | Remove member |

### Tasks — `/api/tasks`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Protected | Dashboard stats |
| GET | `/` | Protected | List tasks (filters: project, status, priority, assignedTo) |
| POST | `/` | Admin | Create task |
| GET | `/:id` | Protected | Get single task |
| PATCH | `/:id` | Protected | Update task (member: status only) |
| DELETE | `/:id` | Admin | Delete task |

**Query parameters for `GET /tasks`:**
```
?page=1&limit=10&status=todo&priority=high&project=<id>&assignedTo=<id>
```

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | List all users |
| GET | `/:id` | Admin | Get user by ID |
| PATCH | `/:id` | Admin | Update user role `{ role }` |
| DELETE | `/:id` | Admin | Delete user |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server status check |

---

## Database Models

### User
```
name        String   required, trim
email       String   required, unique, lowercase
password    String   required, min 6, select: false
role        String   enum: ['admin', 'member'], default: 'member'
avatar      String   optional
timestamps
```
- Pre-save hook hashes password with bcryptjs (salt 12)
- `comparePassword(candidate)` — instance method
- `generateJWT()` — returns signed token

### Project
```
name        String   required, max 100
description String   max 500
owner       ObjectId ref: User, required
members     [ObjectId] ref: User
status      String   enum: ['active', 'completed', 'archived']
deadline    Date     optional
timestamps
```
- Pre-hook on `findOneAndDelete` cascades task deletion

### Task
```
title       String   required, max 200
description String   max 1000
project     ObjectId ref: Project, required
assignedTo  ObjectId ref: User, optional
createdBy   ObjectId ref: User, required
status      String   enum: ['todo', 'in-progress', 'completed']
priority    String   enum: ['low', 'medium', 'high']
dueDate     Date     optional
timestamps
```
- Compound indexes on `(project, status)`, `assignedTo`, `(dueDate, status)`

---

## Role-Based Access Control

| Action | Admin | Member |
|---|---|---|
| View own projects | ✅ | ✅ |
| View all projects | ✅ | ❌ |
| Create / Delete project | ✅ | ❌ |
| Edit project | ✅ (any) | ✅ (own) |
| Add / Remove members | ✅ | ❌ |
| View tasks in own projects | ✅ | ✅ |
| Create / Delete task | ✅ | ❌ |
| Update all task fields | ✅ | ❌ |
| Update task **status** | ✅ | ✅ |
| View / Manage users | ✅ | ❌ |
| Change user roles | ✅ | ❌ |

---

## Demo Credentials

After running `npm run seed`:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@test.com` | `admin123` |
| Member | `member1@test.com` | `member123` |
| Member | `member2@test.com` | `member123` |

> The login page has a **"Fill"** button that auto-populates the admin credentials.

---

## Postman Collection

A ready-to-use Postman collection is included at `backend/postman_collection.json`.

**Import steps:**
1. Open Postman → **Import** → select `postman_collection.json`
2. Set the `baseUrl` collection variable to `http://localhost:5000/api`
3. Run **Login** — the token is automatically saved to the `{{token}}` variable
4. All other requests use `{{token}}` for Bearer auth automatically

The collection includes pre-configured request bodies and test scripts for all 20+ endpoints.

---

## Scripts

### Backend

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start without nodemon (production)
npm run seed     # Seed database with sample data
```

### Frontend

```bash
npm run dev      # Start Vite dev server on port 3000
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Error Handling

The backend handles all common error types and returns consistent JSON:

```json
{
  "success": false,
  "status": "fail",
  "message": "Human-readable error message"
}
```

| Error Type | HTTP Status |
|---|---|
| Invalid ObjectId (CastError) | 400 |
| Mongoose ValidationError | 400 |
| Duplicate key (code 11000) | 400 |
| Unauthorized / bad token | 401 |
| Token expired | 401 |
| Forbidden (wrong role) | 403 |
| Not found | 404 |
| Unhandled server error | 500 |

The frontend Axios interceptor catches 401 responses globally, clears localStorage, and redirects to `/login` automatically.

---

## License

MIT
