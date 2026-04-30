<div align="center">

# 🚀 TaskFlow — Team Task Manager

**A production-ready full-stack web application for managing team projects and tasks**

Built with the **MERN Stack** · Deployed on **Railway** · Secured with **JWT Auth**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-6366f1?style=for-the-badge&logo=railway)](https://your-app.up.railway.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Role-Based Access Control](#-role-based-access-control)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🎯 About the Project

**TaskFlow** is a collaborative team task management platform that enables organizations to manage projects, assign tasks, and track progress in real time. It features a clean, modern UI with a dark sidebar, Kanban board, analytics dashboard, and strict role-based access control.

> Built as a full-stack production project demonstrating end-to-end MERN development, REST API design, JWT authentication, Docker containerization, and cloud deployment.

---

## 🌐 Live Demo

| Link | Description |
|---|---|
| 🔗 [Live Application](https://your-app.up.railway.app) | Deployed on Railway |
| 📮 [API Health Check](https://your-app.up.railway.app/api/health) | Backend status |

**Demo Credentials:**

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@test.com` | `admin123` |
| 👤 Member | `member1@test.com` | `member123` |
| 👤 Member | `member2@test.com` | `member123` |

> The login page has a **"Fill"** button that auto-populates admin credentials instantly.

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18 | JavaScript runtime |
| **Express.js** | ^4.19 | REST API framework |
| **MongoDB Atlas** | Cloud | NoSQL database |
| **Mongoose** | ^8.4 | MongoDB ODM |
| **JSON Web Token** | ^9.0 | Stateless authentication |
| **bcryptjs** | ^2.4 | Password hashing (salt: 12) |
| **express-validator** | ^7.1 | Input validation & sanitization |
| **cors** | ^2.8 | Cross-origin resource sharing |
| **morgan** | ^1.10 | HTTP request logging |
| **dotenv** | ^16.4 | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2 | UI component library |
| **Vite** | ^8.0 | Build tool & dev server |
| **React Router DOM** | ^7.14 | Client-side routing |
| **Axios** | ^1.15 | HTTP client with interceptors |
| **TailwindCSS** | ^3.4 | Utility-first CSS framework |
| **Recharts** | ^3.8 | Dashboard data visualization |
| **React Hot Toast** | ^2.6 | Toast notification system |
| **React Icons** | ^5.6 | Icon library (Feather set) |
| **date-fns** | ^4.1 | Date formatting & manipulation |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| **Docker** | Multi-stage containerization |
| **Railway** | Cloud deployment platform |
| **MongoDB Atlas** | Managed cloud database |
| **GitHub** | Version control & CI/CD trigger |

---

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based stateless authentication (7-day expiry)
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- Auto-logout on token expiry (401 interceptor)
- Password strength indicator (Weak / Medium / Strong)
- Protected routes with role-based guards

### 📊 Analytics Dashboard
- Personalized greeting based on time of day
- **4 KPI cards** — Total, Completed, In Progress, Overdue tasks
- Overall progress bar with completion percentage
- **Donut chart** — Task status distribution (Recharts)
- **Bar chart** — Tasks by priority level (Recharts)
- Recent tasks table with assignee, status, due date

### 📁 Project Management
- Create, edit, delete projects (Admin only)
- Status filter — Active / Completed / Archived
- Member avatar stack on project cards
- Add / remove team members per project
- Cascade delete — removing a project deletes all its tasks
- Pagination (9 projects per page)

### ✅ Task Management
- **Kanban Board** — 3 columns (Todo / In Progress / Completed)
- **List View** — table with inline status dropdown
- Priority-coded left border (🔴 High / 🟡 Medium / 🟢 Low)
- Overdue warning with time-ago display
- Filter by Status, Priority, Project, Assignee
- Grid / List view toggle
- Pagination (10 tasks per page)

### 👥 User Management (Admin)
- Search users by name or email
- Promote / Demote role (Admin ↔ Member)
- Delete users with confirmation dialog
- Self-protection (cannot delete/demote yourself)

### 🎨 UI / UX
- Dark sidebar with gradient active states
- Violet/indigo gradient design system
- Fully responsive — mobile hamburger menu
- Smooth card hover animations
- Backdrop blur modals with ESC-to-close
- Skeleton loading states
- Contextual empty states
- Confirmation dialogs for all destructive actions

---

## 📸 Screenshots

> *(Add screenshots of your deployed app here)*

| Dashboard | Projects | Kanban Board |
|---|---|---|
| ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) | ![Projects](https://via.placeholder.com/300x200?text=Projects) | ![Kanban](https://via.placeholder.com/300x200?text=Kanban) |

| Login | Tasks | Users |
|---|---|---|
| ![Login](https://via.placeholder.com/300x200?text=Login) | ![Tasks](https://via.placeholder.com/300x200?text=Tasks) | ![Users](https://via.placeholder.com/300x200?text=Users) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│   React 19 + Vite  →  Context API  →  Axios HTTP Client    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS REST API
┌──────────────────────────▼──────────────────────────────────┐
│                        SERVER                               │
│   Express.js  →  JWT Middleware  →  Route Controllers       │
│   express-validator  →  Mongoose ODM  →  Error Handler      │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose
┌──────────────────────────▼──────────────────────────────────┐
│                      DATABASE                               │
│              MongoDB Atlas (Cloud)                          │
│         Users  ·  Projects  ·  Tasks                        │
└─────────────────────────────────────────────────────────────┘
```

**Request Flow:**
```
Browser → React Router → Page Component → Axios (+ JWT header)
       → Express Route → Auth Middleware → Controller
       → Mongoose Query → MongoDB Atlas
       → JSON Response → Context State → UI Update
```

---

## 📂 Project Structure

```
taskflow/
├── 🐳 Dockerfile                  ← Multi-stage Docker build
├── 🚂 railway.toml                ← Railway deployment config
├── 📖 README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      ← Register, Login, GetMe
│   │   ├── projectController.js   ← Project CRUD + members
│   │   ├── taskController.js      ← Task CRUD + dashboard
│   │   └── userController.js      ← Admin user management
│   ├── middleware/
│   │   ├── authMiddleware.js      ← JWT protect + RBAC restrictTo
│   │   ├── errorMiddleware.js     ← Global error handler
│   │   └── validateMiddleware.js  ← express-validator formatter
│   ├── models/
│   │   ├── User.js                ← Schema + bcrypt hooks + JWT method
│   │   ├── Project.js             ← Schema + cascade delete hook
│   │   └── Task.js                ← Schema + compound indexes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── AppError.js            ← Custom operational error class
│   ├── seed.js                    ← Database seeder
│   ├── server.js                  ← App entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.js           ← Axios instance + interceptors
    │   ├── context/
    │   │   ├── AuthContext.jsx    ← Auth state management
    │   │   └── TaskContext.jsx    ← Global app state
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useProjects.js
    │   │   └── useTasks.js
    │   ├── components/
    │   │   ├── common/            ← Button, Input, Modal, Badge,
    │   │   │                         Loader, EmptyState, ConfirmDialog
    │   │   ├── layout/            ← Sidebar, Navbar, Layout
    │   │   ├── dashboard/         ← StatsCard, Charts, RecentTasks
    │   │   ├── projects/          ← ProjectCard, ProjectForm, MembersList
    │   │   └── tasks/             ← TaskCard, TaskForm, Filters, Kanban
    │   ├── pages/
    │   │   ├── auth/              ← Login, Register
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Users.jsx
    │   │   └── NotFound.jsx
    │   └── utils/
    │       ├── constants.js       ← Enums + color maps
    │       └── helpers.js         ← formatDate, getInitials, etc.
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.0.0
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

```bash
# Backend — create backend/.env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Frontend — create frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

Creates: 1 Admin + 2 Members + 2 Projects + 5 Tasks

### 5. Run the application

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

---

## 📡 API Reference

All protected routes require:
```http
Authorization: Bearer <jwt_token>
```

### Authentication `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user |
| `POST` | `/login` | Public | Login → returns JWT + user |
| `GET` | `/me` | Protected | Get current user profile |
| `POST` | `/logout` | Protected | Logout |

### Projects `/api/projects`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Protected | List projects |
| `POST` | `/` | Admin | Create project |
| `GET` | `/:id` | Protected | Get project details |
| `PATCH` | `/:id` | Admin/Owner | Update project |
| `DELETE` | `/:id` | Admin | Delete project + tasks |
| `POST` | `/:id/members` | Admin | Add member |
| `DELETE` | `/:id/members/:userId` | Admin | Remove member |

### Tasks `/api/tasks`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard` | Protected | Dashboard statistics |
| `GET` | `/` | Protected | List tasks with filters |
| `POST` | `/` | Admin | Create task |
| `GET` | `/:id` | Protected | Get task details |
| `PATCH` | `/:id` | Protected | Update task |
| `DELETE` | `/:id` | Admin | Delete task |

**Task filters:** `?status=todo&priority=high&project=<id>&assignedTo=<id>&page=1&limit=10`

### Users `/api/users` *(Admin only)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List all users |
| `GET` | `/:id` | Get user by ID |
| `PATCH` | `/:id` | Update user role |
| `DELETE` | `/:id` | Delete user |

---

## 🗄 Database Models

### User Model
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, trim |
| `email` | String | required, unique, lowercase |
| `password` | String | required, min:6, **select:false** |
| `role` | String | enum: admin/member, default: member |
| `avatar` | String | optional |

**Methods:** `comparePassword()` · `generateJWT()`  
**Hooks:** Pre-save bcrypt hash (salt: 12)

### Project Model
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, max:100 |
| `description` | String | max:500 |
| `owner` | ObjectId | ref: User, required |
| `members` | [ObjectId] | ref: User |
| `status` | String | active/completed/archived |
| `deadline` | Date | optional |

**Hooks:** Pre-delete cascades all project tasks

### Task Model
| Field | Type | Constraints |
|---|---|---|
| `title` | String | required, max:200 |
| `description` | String | max:1000 |
| `project` | ObjectId | ref: Project, required |
| `assignedTo` | ObjectId | ref: User, optional |
| `createdBy` | ObjectId | ref: User, required |
| `status` | String | todo/in-progress/completed |
| `priority` | String | low/medium/high |
| `dueDate` | Date | optional |

**Indexes:** `(project, status)` · `assignedTo` · `(dueDate, status)`

---

## 🔐 Role-Based Access Control

| Feature | 👑 Admin | 👤 Member |
|---|:---:|:---:|
| View all projects | ✅ | ❌ |
| View own projects | ✅ | ✅ |
| Create / Delete project | ✅ | ❌ |
| Edit project | ✅ | ✅ (own) |
| Add / Remove members | ✅ | ❌ |
| Create / Delete task | ✅ | ❌ |
| Update all task fields | ✅ | ❌ |
| Update task status only | ✅ | ✅ |
| View & manage users | ✅ | ❌ |
| Change user roles | ✅ | ❌ |

---

## ☁️ Deployment

This project is deployed on **Railway** using Docker.

### Architecture
- **Single service** — Express serves both the REST API and the React SPA
- **Multi-stage Dockerfile** — frontend built in Stage 1, served by backend in Stage 2
- **MongoDB Atlas** — managed cloud database

### Environment Variables (Production)
| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_DIST_PATH` | `/app/frontend/dist` |

### Deploy your own
1. Fork this repository
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repo
4. Add the environment variables above
5. Railway auto-deploys on every push to `main` ✅

---

## 👨‍💻 Author

**Aryan Gupta**

> This project was built to demonstrate full-stack development skills including REST API design, React state management, JWT authentication, role-based access control, Docker containerization, and cloud deployment.

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ using the MERN Stack

</div>
