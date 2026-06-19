# 🪑 SeatLock

**SeatLock** is a full-stack seat reservation and booking platform. Users can browse events, temporarily reserve seats with a countdown timer, and confirm those reservations into permanent bookings — all in real time. It's designed to prevent double-booking through atomic database transactions and a multi-step reserve-then-confirm flow.

> 🌐 **Live Demo**: [https://seatlock.yatishchaubal.online](https://seatlock.yatishchaubal.online)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Assumptions](#assumptions)

---

## Overview

SeatLock implements a **two-phase booking model**:

1. **Reserve** — A user picks seats. Those seats are locked for **10 minutes** and no one else can pick them.
2. **Confirm** — Within that window, the user confirms the booking, permanently claiming the seats.

If the user doesn't confirm in time, a background cron job automatically releases those seats back to the available pool.

---

## Features

| Feature | Details |
|---|---|
| **Auth** | Register, Login, Logout, Change Password — JWT via `HttpOnly` cookies |
| **Events** | Create, read, update, delete events with seat capacity |
| **Seat Grid** | Visual seat map per event showing `available`, `reserved`, and `booked` states |
| **Reservations** | Temporarily reserve seats for 10 minutes with live countdown timer |
| **Bookings** | Confirm reservations into permanent bookings; paginated booking history |
| **KPI Dashboard** | Total events, upcoming events, completed events at a glance |
| **Auto-Expiry** | Cron job runs every minute to release expired reserved seats |
| **Search** | Search events by name with pagination |
| **Dark Mode** | System-aware theme toggle (light/dark) |
| **Input Validation** | Zod schemas on both backend (via middleware) and frontend (via react-hook-form) |

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Language | TypeScript (ES2022, NodeNext modules) |
| Database | MongoDB Atlas via Mongoose 9 |
| Auth | JWT (jsonwebtoken) + HttpOnly cookies |
| Password Hashing | bcryptjs (10 rounds) |
| Validation | Zod |
| CORS | `cors` middleware |
| Security | `helmet`, `mongo-sanitize` |
| Cron Jobs | `node-cron` |
| Dev Server | `nodemon` + `tsx` |
| Containerization | Docker (multi-stage build, Node 20 Alpine) |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Component Library | Shadcn/UI + Radix UI |
| State Management | Redux Toolkit |
| HTTP Client | Axios (with `withCredentials: true`) |
| Forms | React Hook Form + Zod resolvers |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Fonts | Geist Sans & Geist Mono (Google Fonts) |
| Theme | next-themes (system/light/dark) |

---

## Project Structure

```
SeatLock/
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── app.ts              # Express app setup (middleware, routes)
│   │   ├── server.ts           # Entry point — DB connect, cron start, listen
│   │   ├── config/
│   │   │   └── db.ts           # Mongoose connection (dbName: "SeatLock")
│   │   ├── controllers/        # Thin controllers — call service, return response
│   │   │   ├── auth.controller.ts
│   │   │   ├── event.controller.ts
│   │   │   ├── reservation.controller.ts
│   │   │   └── booking.controller.ts
│   │   ├── services/           # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── event.service.ts
│   │   │   ├── reservation.service.ts   # ← Core anti-double-booking logic
│   │   │   └── booking.service.ts       # ← Confirm booking with transaction
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── user.model.ts
│   │   │   ├── event.model.ts
│   │   │   ├── seat.model.ts   # ← Compound unique index: (eventId, seatNumber)
│   │   │   ├── reservation.model.ts
│   │   │   └── booking.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── event.routes.ts
│   │   │   ├── reservation.routes.ts
│   │   │   └── booking.routes.ts
│   │   ├── middlewares/
│   │   │   ├── isAuth.middleware.ts     # JWT cookie verification
│   │   │   └── validate.middleware.ts   # Zod schema validation (body or query)
│   │   ├── validators/         # Zod schemas for each domain
│   │   │   ├── auth.validator.ts
│   │   │   ├── event.validator.ts
│   │   │   └── reservation.validate.ts
│   │   ├── jobs/
│   │   │   ├── cron.ts                         # node-cron scheduler (every minute)
│   │   │   └── releaseExpiredReservations.ts   # Cleanup job
│   │   ├── utils/
│   │   │   ├── errorHandler.ts   # Custom Error class with statusCode
│   │   │   ├── tryCatch.ts       # HOC to wrap async controllers
│   │   │   └── generateJWT.ts    # Signs JWT (7d expiry)
│   │   └── types/              # TypeScript interface definitions
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Next.js 16 App Router
    └── src/
        ├── app/
        │   ├── layout.tsx              # Root layout (Redux, ThemeProvider, Toaster)
        │   ├── globals.css             # Global Tailwind + CSS variables
        │   ├── (auth)/
        │   │   ├── login/page.tsx      # Login page
        │   │   └── register/page.tsx   # Registration page
        │   └── (dashboard)/
        │       ├── layout.tsx          # Dashboard shell (nav, sidebar)
        │       ├── page.tsx            # Home/landing with quick actions
        │       ├── events/
        │       │   ├── page.tsx        # Event list + search + create dialog
        │       │   └── [id]/page.tsx   # Event detail + interactive seat grid
        │       ├── reservations/
        │       │   ├── page.tsx        # My reservations list
        │       │   └── [id]/page.tsx   # Reservation detail + confirm button
        │       ├── bookings/page.tsx   # My bookings (paginated)
        │       └── profile/page.tsx    # Profile + change password
        ├── components/
        │   ├── auth/                   # AuthInitializer (loads user on mount)
        │   ├── event/                  # Event cards, seat grid, create form
        │   ├── reservations/           # Reservation cards with countdown
        │   ├── layout/                 # Navbar, sidebar, navigation
        │   ├── loading.tsx             # Shared loading spinner
        │   └── ui/                     # Shadcn/UI primitives
        ├── services/                   # Axios API call wrappers
        │   ├── auth.service.ts
        │   ├── event.service.ts
        │   ├── reservation.service.ts
        │   └── booking.service.ts
        ├── slices/
        │   └── authSlice.ts            # Redux slice: user, isAuth, loading
        ├── store/
        │   └── store.ts                # Redux store config
        ├── hooks/
        │   ├── useRedux.ts             # Typed useAppSelector / useAppDispatch
        │   └── useCountdown.ts         # Live MM:SS countdown from expiry date
        ├── lib/
        │   ├── axios.ts                # Axios instance (baseURL, withCredentials)
        │   └── utils.ts                # clsx + tailwind-merge helper
        ├── providers/                  # AppProvider (Redux Provider wrapper)
        ├── schemas/                    # Zod schemas for forms
        └── types/                      # TypeScript types (User, Event, etc.)
```

---

## Architecture & Design Decisions

### 1. How Double Booking Is Prevented

This is the core challenge of a seat booking system. SeatLock solves it through **three complementary layers**:

#### Layer 1: MongoDB Compound Unique Index
The `Seat` collection has a compound unique index on `(eventId, seatNumber)`:
```typescript
// seat.model.ts
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
```
This makes it **physically impossible** for the same seat to be duplicated at the database level.

#### Layer 2: Seat Status State Machine
Every seat tracks a status: `available → reserved → booked`. The reservation service only grabs seats where `status === "available"`:
```typescript
// reservation.service.ts
const unavailableSeats = seats.filter((seat) => seat.status !== "available");
if (unavailableSeats.length > 0) throw new ErrorHandler(400, "Seat X is not available");
```
So two users racing to grab the same seat will result in one failing with a clear error.

#### Layer 3: Mongoose Transactions (ACID)
Both `reserveSeats` and `confirmBooking` run inside a **Mongoose transaction** with a session:
```typescript
const session = await mongoose.startSession();
session.startTransaction();
// ... all reads and writes use `.session(session)`
await session.commitTransaction();
// on error → await session.abortTransaction();
```
This ensures atomicity: either all the writes (update seats + create reservation) succeed together, or none do. There's no partial state.

#### Layer 4: 10-Minute Expiry Window + Cron Cleanup
When seats are reserved, a `reservedUntil` timestamp is stored (now + 10 min). The booking confirmation also checks this:
```typescript
if (reservation.expiredAt < new Date()) throw new ErrorHandler(400, "Reservation is expired!");
```
A `node-cron` job runs **every minute** and releases all seats whose `reservedUntil` has passed:
```typescript
// cron.ts
cron.schedule("* * * * *", async () => {
  await releaseExpiredReservations();
});
```

---

### 2. Controller → Service Pattern

Controllers are kept thin — they only read from `req`, call a service function, and send a response. All business logic lives in the `services/` layer. This makes the services independently testable and swappable.

### 3. TryCatch HOC

Instead of wrapping every controller in `try/catch`, a higher-order function `TryCatch()` wraps every async controller. If the error is an `ErrorHandler` instance, it returns its `statusCode`. Otherwise it returns 500.

```typescript
// utils/tryCatch.ts
export const TryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    if (error instanceof ErrorHandler)
      return res.status(error.statusCode).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};
```

### 4. JWT in HttpOnly Cookies

The JWT token is stored in an `HttpOnly` cookie (not `localStorage`). This prevents XSS attacks from reading the token via JavaScript. The `isAuth` middleware reads the token from `req.cookies.jwtToken`. JWT tokens expire in **7 days**.

### 5. Zod Validation Middleware

A shared `validate(schema, target)` middleware accepts a Zod schema and either `"body"` (default) or `"query"`, validating the request data before it reaches the controller. Errors are returned as structured field-level messages.

### 6. Seat Auto-Generation

When an event is created with `totalSeats: N`, the backend automatically generates `N` seat documents (`A1`, `A2`, ..., `AN`) via `Seat.insertMany()`. This ensures there's always a single source of truth for seating.

### 7. Frontend State (Redux Toolkit)

Global auth state (`user`, `isAuth`, `loading`) is managed in Redux. On app mount, an `AuthInitializer` component calls `/api/auth/me` to hydrate the auth state from the existing cookie, giving seamless session persistence without relying on `localStorage`.

---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Bcrypt hashed (10 rounds) |
| `timestamps` | — | `createdAt`, `updatedAt` |

### Event
| Field | Type | Notes |
|---|---|---|
| `name` | String | 3–100 chars |
| `venue` | String | 3–200 chars |
| `dateTime` | Date | Must be in the future (on create) |
| `totalSeats` | Number | min: 1 |
| `timestamps` | — | `createdAt`, `updatedAt` |

### Seat
| Field | Type | Notes |
|---|---|---|
| `eventId` | ObjectId | ref: Event, indexed |
| `seatNumber` | String | e.g., `A1`, `A2`, ... |
| `status` | String | `"available"` \| `"reserved"` \| `"booked"` |
| `reservedBy` | ObjectId | ref: User, nullable |
| `reservedUntil` | Date | Set to now + 10 min when reserved; null otherwise |
| `timestamps` | — | `createdAt`, `updatedAt` |

**Indexes**: Compound unique index on `(eventId, seatNumber)`.

### Reservation *(temporary — deleted on confirm or expiry)*
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | ref: User |
| `eventId` | ObjectId | ref: Event |
| `seatNumbers` | String[] | Array of reserved seat numbers |
| `expiredAt` | Date | now + 10 minutes |
| `timestamps` | — | `createdAt`, `updatedAt` |

**Indexes**: TTL index on `expiresAt` with `expireAfterSeconds: 0` (MongoDB auto-deletes expired docs).

### Booking *(permanent)*
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | ref: User |
| `eventId` | ObjectId | ref: Event |
| `seatNumbers` | String[] | Confirmed seat numbers |
| `bookedAt` | Date | `Date.now` |
| `timestamps` | — | `createdAt`, `updatedAt` |

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | ✗ | `{ name, email, password }` | Register a new user |
| POST | `/login` | ✗ | `{ email, password }` | Login, sets JWT cookie |
| POST | `/logout` | ✓ | — | Clears JWT cookie |
| POST | `/change-password` | ✓ | `{ currentPassword, newPassword }` | Change password |
| GET | `/me` | ✓ | — | Get current user profile |

**Password rules**: min 8 chars, at least one uppercase, one lowercase, one digit.

### Events — `/api/event`

| Method | Endpoint | Auth | Body / Query | Description |
|---|---|---|---|---|
| GET | `/` | ✗ | `?page&limit&search` | List all events (paginated, searchable) |
| GET | `/kpis` | ✗ | — | Total / upcoming / completed event counts |
| GET | `/:id` | ✗ | — | Single event with seat stats |
| GET | `/:eventId/seats` | ✗ | — | All seats for an event |
| POST | `/create` | ✓ | `{ name, venue, dateTime, totalSeats }` | Create event + auto-generate seats |
| PATCH | `/:id` | ✓ | Partial event fields | Update event details |
| DELETE | `/:id` | ✓ | — | Delete event + all its seats |

### Reservations — `/api/reservations`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/create/:eventId` | ✓ | `{ seatNumbers: string[] }` | Reserve seats (10-min lock) |
| GET | `/my` | ✓ | — | Get current user's active reservations |
| GET | `/:reservationId` | ✓ | — | Get a single reservation by ID |

### Bookings — `/api/booking`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/:reservationId` | ✓ | — | Confirm reservation → permanent booking |
| GET | `/my` | ✓ | `?page` | Get current user's bookings (paginated, 9/page) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9
- **MongoDB Atlas** cluster (or a local MongoDB 6+ instance with a replica set enabled for transactions)
- **Git**

> ⚠️ **Important**: Mongoose transactions require a **MongoDB replica set**. MongoDB Atlas clusters have this enabled by default. A plain standalone local MongoDB instance will cause transaction errors. If running locally, either use Atlas or [set up a local replica set](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/).

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd SeatLock/backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env   # or create .env manually (see Environment Variables below)

# 4. Start the development server (with hot reload)
npm run dev
```

The backend will start at **http://localhost:5000**.

**Other scripts:**

```bash
# Compile TypeScript to dist/
npm run build

# Start compiled production build
npm start
```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd SeatLock/frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
# Create a .env file (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The frontend will start at **http://localhost:3000**.

**Other scripts:**

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | ✗ | Port the server listens on (default: `5000`) | `5000` |
| `MONGODB_URI` | ✓ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET` | ✓ | Secret key for signing JWTs | `my_super_secret_key` |
| `CLIENT_URL` | ✓ | Frontend origin for CORS (no trailing slash) | `http://localhost:3000` |

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Do NOT add a trailing slash** to `CLIENT_URL`. The CORS `Origin` header never includes one, and a mismatch will block all cross-origin requests.

### Frontend — `frontend/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✓ | Base URL for all API calls | `http://localhost:5000/api` |

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Docker Deployment

The backend includes a **multi-stage Dockerfile** that produces a lean production image.

```bash
# Build the image
cd SeatLock/backend
docker build -t seatlock-backend .

# Run the container (pass env vars at runtime)
docker run -p 5000:5000 \
  -e MONGODB_URI="your_mongo_uri" \
  -e JWT_SECRET="your_secret" \
  -e CLIENT_URL="https://your-frontend.com" \
  seatlock-backend
```

**How the Dockerfile works:**
1. **Stage 1 (builder)**: Installs all deps, copies source, compiles TypeScript → `dist/`
2. **Stage 2 (runner)**: Fresh Node 20 Alpine image, installs only production deps, copies `dist/` from builder
3. Exposes port **5000** and runs `npm start` (`node dist/server.js`)

---

## Assumptions

1. **Single role system**: There is no admin/user role distinction. Any authenticated user can create, update, and delete events. Authorization is purely authentication-based.

2. **Seat numbering is linear**: Seats are auto-generated as `A1` to `AN` when an event is created. There is no row/section concept — all seats belong to one flat pool.

3. **One reservation per action**: A user can create multiple reservations for the same event (for different seats). There is no constraint preventing a user from holding several active reservations simultaneously.

4. **MongoDB Atlas is required**: Transactions are used for both reservation and booking operations. A replica set (provided by Atlas) is mandatory. Standalone MongoDB instances are not supported.

5. **No payment integration**: Booking confirmation is immediate — there is no payment gateway, checkout flow, or external validation step between reservation and booking.

6. **No email notifications**: There is no email confirmation sent on registration, booking, or reservation expiry. Toasts provide UI feedback.

7. **10-minute reservation window is fixed**: The expiry duration is hardcoded as `Date.now() + 10 * 60 * 1000`. It is not configurable per event.

8. **Seat release has up to 1-minute latency**: The cron job runs every minute (`* * * * *`), so an expired reservation may take up to 60 seconds to be released after its `reservedUntil` timestamp passes.

9. **Cookie-based auth requires same-site or HTTPS**: The JWT is in an `HttpOnly` cookie. In production, the frontend and backend must share a domain or the cookie must be configured with `SameSite=None; Secure` for cross-origin use.

10. **No refresh token**: The JWT has a 7-day TTL. There is no refresh mechanism. After expiry, users must log in again.

---

## Scripts Reference

| Location | Command | Description |
|---|---|---|
| `backend/` | `npm run dev` | Start dev server with hot reload (`nodemon` + `tsx`) |
| `backend/` | `npm run build` | Compile TypeScript to `dist/` |
| `backend/` | `npm start` | Run compiled production build |
| `frontend/` | `npm run dev` | Start Next.js dev server |
| `frontend/` | `npm run build` | Build Next.js for production |
| `frontend/` | `npm start` | Start Next.js production server |
| `frontend/` | `npm run lint` | Run ESLint |

---

*Built with ❤️ using Node.js, Express, MongoDB, Next.js, and TypeScript.*
