# Apple Phone — 3D E-Commerce

*(repository: `apple-phone`)*

An interactive, Apple-style product site for a fictional iPhone lineup: a real-time 3D device
viewer, a full cart-to-checkout flow with Stripe payments, and a custom JWT authentication system
with password reset — built as a full-stack e-commerce reference project rather than a landing
page.

## Overview

The engineering focus here is the complete commerce loop, not just the 3D model. Product variants
(color, storage, size) carry per-variant pricing; the cart, checkout, and order history all
operate on top of a normal relational schema via Prisma; payments go through Stripe Payment
Intents with a proper client-side Elements form, not a mocked checkout button. The 3D model itself
is proxied server-side from Cloudinary so the browser receives the correct `model/gltf-binary`
MIME type, which is a real, easy-to-get-wrong detail when serving GLB files from a generic asset
host.

## Features

- **Interactive 3D product viewer** — Three.js + React Three Fiber, with the model proxied
  server-side for correct content-type handling
- **GSAP animations** — scroll-triggered and timeline-based, across Hero, Highlights, and
  How-It-Works sections
- **Custom authentication** — JWT stored in an `HttpOnly` cookie; sign-up, sign-in, sign-out, and
  forgot/reset password via a one-time email code
- **Product catalog** with multi-variant products (color, storage, size) and per-variant pricing
- **Cart** — add, update, remove, with denormalized per-variant pricing on each line
- **Checkout & payments** — Stripe Payment Intents, client-side Elements form, optional address
  save on order
- **Order management** — order creation, history, per-order detail, and a status-progression
  timeline (`CONFIRMED` → `SHIPPED` → `DELIVERED`, etc.)
- **Address book** with duplicate detection on save
- **Error monitoring** via Sentry, production-only
- **Transactional email** (password-reset codes) via Resend

## Tech Stack

**Frontend**
React 19, React Router v7, Vite 7, Tailwind CSS 4, Three.js + React Three Fiber + Drei, GSAP,
Stripe Elements (`@stripe/react-stripe-js`), Sentry (`@sentry/react`)

**Backend**
Express 5, Prisma ORM with `@prisma/adapter-pg`, bcryptjs, JSON Web Tokens, the Stripe Node SDK,
Resend, Helmet, `cors`, `compression`

**Database**
PostgreSQL via Prisma. Models: `User`, `Product`, `ProductVariant`, `CartItem`, `Order`,
`OrderItem`, `OrderStatusHistory`, `Address`.

## Architecture

The frontend (Vite/React) and backend (Express) are two separate deployments — a static SPA on
Vercel and a Node API on a separate host — communicating over `VITE_API_URL` with credentialed
requests so the JWT cookie is sent cross-origin. `server/index.js` maintains an explicit
`allowedOrigins` list for CORS rather than a wildcard, since the auth cookie is `HttpOnly` and
credentialed CORS requires an exact origin match.

## Project Structure

```
prisma/
├── schema.prisma
└── seed.js

server/
├── index.js               # Express entry — CORS, middleware, route mounting
├── middleware/auth.js       # JWT verification (cookie or Authorization header)
├── routes/                  # auth, user, products, cart, payment, orders, assets
└── utils/                    # JWT helpers, email, Prisma client singleton

src/
├── main.jsx                 # Entry point, Sentry init
├── App.jsx                   # Router, providers, lazy-loaded routes
├── components/                 # Navbar, Hero, 3D Model viewer, etc.
├── pages/
├── context/                    # AuthContext, CartContext
└── utils/
```

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- Stripe and Resend accounts

### Install

```bash
npm install
```

### Environment variables

Backend (`.env` in project root):

```
DATABASE_URL
DIRECT_URL
JWT_SECRET
STRIPE_SECRET_KEY
RESEND_API_KEY
CLOUDINARY_URL
CLIENT_URL
NODE_ENV
PORT                    # optional, defaults to 5000
```

Frontend (must be prefixed `VITE_`):

```
VITE_API_URL
VITE_STRIPE_PUBLISHABLE_KEY
VITE_SENTRY_DSN          # optional
```

### Database

```bash
npm run db:push
npm run db:seed   # optional — sample product data
```

### Run

```bash
npm run dev:all     # Vite (5173) + Express (5000) together
# or separately:
npm run dev          # frontend only
npm run server         # backend only
```

## API Endpoints

All routes are prefixed `/api`. Protected routes require a valid `auth_token` cookie or
`Authorization: Bearer <token>` header.

| Group | Base path | Notable routes |
|---|---|---|
| Auth | `/api/auth` | `signup`, `signin`, `signout`, `forgot-password`, `reset-password`, `me` |
| User | `/api/user` | `profile`, `addresses` (CRUD) |
| Products | `/api/products` | `:slug` |
| Cart | `/api/cart` | CRUD + `clear` |
| Payment | `/api/payment` | `create-payment-intent` |
| Orders | `/api/orders` | `create`, list, detail by id or order number, status update |
| Assets | `/api/assets` | `scene.glb` — GLB model proxy with correct MIME type |
| Health | `/api/health` | Liveness check |

## Deployment

- **Frontend** — Vercel, static build (`npm run build`, output `dist`), with `vercel.json`
  rewriting all paths to `/` for client-side routing.
- **Backend** — designed for Railway or any Node host that provides `PORT` and binds to
  `0.0.0.0`; the production frontend origin must be present in `server/index.js`'s
  `allowedOrigins`.

## Current Status

The frontend is deployed and live. **The backend API is currently offline** — its Railway
deployment is no longer reachable, which also means its PostgreSQL database (hosted on the same
Railway project) is unavailable, and a separate Supabase project referenced by the client is
paused. As a result, live product data, auth, cart, and checkout are not currently functional on
the deployed frontend, even though all of that logic is implemented and was working. This is an
infrastructure/hosting gap, not an incomplete feature — restoring it is a matter of redeploying
the backend and re-provisioning the database, not writing new code.
