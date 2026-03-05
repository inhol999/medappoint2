# MedAppoint — Full-Stack Healthcare Platform

A complete web application for clinic management, doctor scheduling, and patient appointment booking built with **Next.js 14**, **MySQL (Prisma ORM)**, and **NextAuth.js**.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Backend | Next.js API Routes (serverless) |
| Database | MySQL 8+ via Prisma ORM |
| Authentication | NextAuth.js (JWT sessions, bcrypt) |
| Styling | Vanilla CSS (DM Sans, custom design system) |
| Messaging | Polling-based real-time messages |

---

## 📁 Project Structure

```
medapoint/
├── prisma/
│   ├── schema.prisma          # Database schema (all models)
│   ├── seed.js                # Seed initial data
│   └── init.sql               # Database creation script
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   │   └── register/route.ts        # Patient registration
│   │   │   ├── admin/stats/route.ts         # Admin dashboard stats
│   │   │   ├── users/[id]/route.ts          # User CRUD
│   │   │   ├── clinics/[id]/route.ts        # Clinic CRUD
│   │   │   ├── doctors/route.ts             # Doctor listing
│   │   │   ├── schedules/route.ts           # Schedule management
│   │   │   ├── appointments/[id]/route.ts   # Appointment actions
│   │   │   ├── messages/route.ts            # Messaging system
│   │   │   ├── payments/route.ts            # Payment tracking
│   │   │   └── assessments/route.ts         # Pre-assessment
│   │   │
│   │   ├── admin/             # Admin portal (role-protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard with stats
│   │   │   ├── users/         # User management
│   │   │   ├── doctors/       # Create & manage doctors
│   │   │   ├── clinics/       # Clinic management
│   │   │   ├── appointments/  # All appointments
│   │   │   ├── schedules/     # Schedule management
│   │   │   ├── payments/      # Payment overview
│   │   │   └── messages/      # Messaging
│   │   │
│   │   ├── doctor/            # Doctor portal (role-protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── appointments/  # Manage appointments
│   │   │   ├── schedules/     # Set availability
│   │   │   ├── patients/      # Patient list
│   │   │   ├── messages/      # Messaging
│   │   │   └── profile/       # Profile settings
│   │   │
│   │   ├── patient/           # Patient portal (role-protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── find/          # Browse & book clinics
│   │   │   ├── appointments/  # Manage appointments + pay
│   │   │   ├── payments/      # Payment history
│   │   │   ├── messages/      # Message clinic/doctor
│   │   │   └── profile/       # Profile settings
│   │   │
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── page.tsx           # Root redirect
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── Sidebar.tsx        # Role-aware navigation sidebar
│   │   └── MessagesPage.tsx   # Shared messaging component
│   │
│   └── lib/
│       ├── prisma.ts          # Prisma singleton client
│       └── auth.ts            # Auth helpers (requireAuth)
│
├── .env.example
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Setup Instructions

### 1. Prerequisites

- **Node.js** 18+ 
- **MySQL** 8.0+
- npm or yarn

### 2. Clone and Install

```bash
git clone <your-repo>
cd medapoint
npm install
```

### 3. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE medapoint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/medapoint"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
```

Generate a secret with:
```bash
openssl rand -base64 32
```

### 5. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

### 6. Seed the Database

```bash
node prisma/seed.js
```

### 7. Start the Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 👤 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Doctor | `dr.santos` | `doctor123` |
| Patient | `juan.dela.cruz` | `patient123` |

---

## 🔐 Authentication & Authorization

- **JWT-based sessions** via NextAuth.js
- **Role-based access control** on all API routes using `requireAuth(['ADMIN'])` helper
- **Doctors can ONLY be created by Admins** (no self-registration for doctors)
- **Patients** self-register at `/register`
- Session cookies expire after **24 hours**

### Role Permissions

| Action | Admin | Doctor | Patient |
|--------|-------|--------|---------|
| Create doctor accounts | ✅ | ❌ | ❌ |
| Manage clinics | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| Approve appointments | ✅ | ✅ | ❌ |
| Book appointments | ❌ | ❌ | ✅ |
| Make payments | ❌ | ❌ | ✅ |
| Message anyone | ✅ | ✅ | ✅ |
| Set schedules | ✅ | ✅ | ❌ |

---

## 🗄 Database Schema

### Core Models

```
User ──┬── Admin
       ├── Doctor ──── Clinic
       └── Patient

Doctor ──── Schedule ──── Appointment ──┬── Payment
                      │                 └── PreAssessment
                      └── Patient

User ──── Message (sender/receiver)
```

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Authentication (username, password hash, role) |
| `admins` | Admin profile |
| `doctors` | Doctor profile + clinic assignment |
| `patients` | Patient profile |
| `clinics` | Clinic information |
| `schedules` | Doctor weekly availability |
| `appointments` | Booking records |
| `payments` | Payment tracking with receipts |
| `pre_assessments` | Pre-visit questionnaires |
| `messages` | User-to-user messaging |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public (patients only) |
| POST | `/api/auth/signin` | Public |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| POST | `/api/users` | Admin (creates doctors) |
| GET | `/api/users/:id` | Auth (own or admin) |
| PUT | `/api/users/:id` | Auth (own or admin) |
| DELETE | `/api/users/:id` | Admin |

### Clinics
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/clinics` | Public |
| POST | `/api/clinics` | Admin |
| GET | `/api/clinics/:id` | Public |
| PUT | `/api/clinics/:id` | Admin |
| DELETE | `/api/clinics/:id` | Admin |

### Appointments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/appointments` | Auth (filtered by role) |
| POST | `/api/appointments` | Patient |
| PUT | `/api/appointments/:id` | Auth |

### Messages
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/messages` | Auth |
| GET | `/api/messages?with=userId` | Auth (conversation) |
| POST | `/api/messages` | Auth |

### Other
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/stats` | Admin |
| GET/POST | `/api/schedules` | Auth |
| GET/POST | `/api/payments` | Auth |
| GET/POST | `/api/assessments` | Auth |

---

## ✨ Features

### Admin Dashboard
- 📊 Real-time stats (patients, doctors, clinics, revenue)
- 👥 User management with role filters
- 🩺 **Create doctor accounts** (only admin can do this)
- 🏥 Clinic CRUD with doctor assignment
- 📅 All appointment management (approve/cancel/complete)
- 🗓 Schedule management for all doctors
- 💳 Payment overview with totals
- 💬 Message any user

### Doctor Portal
- 📋 Appointment queue with approve/decline/complete
- 🗓 Set own weekly schedule and availability
- 👤 View list of patients seen
- 💬 Message patients and admin
- ⚙️ Profile management

### Patient Portal
- 🔍 Browse all clinics and doctors with search
- 📅 Book appointments with date/time picker
- 💳 Payment system (GCash, Maya, Cash, etc.)
- 💬 Message doctors and clinic staff
- ⚙️ Profile management
- 📊 Appointment history

---

## 🛠 Common Issues

**Prisma client not generated:**
```bash
npx prisma generate
```

**Database connection error:**
Check your `DATABASE_URL` in `.env` — ensure MySQL is running and the database exists.

**NextAuth secret missing:**
Ensure `NEXTAUTH_SECRET` is set in `.env`. Use `openssl rand -base64 32` to generate one.

**Session not persisting:**
Ensure `NEXTAUTH_URL` matches your actual URL (e.g., `http://localhost:3000`).
