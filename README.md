# Apple iPhone E-Commerce

A full-stack iPhone e-commerce web application inspired by Apple's design language. Featuring 3D interactive iPhone model viewing, GSAP-powered animations, Stripe payments, JWT authentication, and a complete order management flow.

---

## Features

- **3D Product Viewer** — Interactive iPhone model rendered with Three.js and React Three Fiber, proxied from Cloudinary with correct MIME type handling
- **GSAP Animations** — Scroll-triggered and timeline-based animations throughout the landing page (Hero, Highlights, HowItWorks)
- **Authentication** — JWT-based auth stored in secure `HttpOnly` cookies; sign-up, sign-in, sign-out, forgot/reset password via OTP email
- **Product Catalog** — Products with multiple variants (color, storage, size) and per-variant pricing
- **Shopping Cart** — Add, update, and remove items; per-variant cart lines with denormalized price
- **Checkout & Payments** — Stripe Payment Intents; client-side Elements form; optional address save
- **Order Management** — Order creation, order history, per-order detail view, order tracking with status progression
- **Address Book** — CRUD for saved shipping addresses; duplicate detection on save
- **Error Monitoring** — Sentry integrated at runtime (production-only)
- **Performance** — Gzip compression, Helmet security headers, manual Rollup chunk splitting, service worker
- **Email** — Transactional OTP emails via Resend

---

## Tech Stack

### Frontend

| Library | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM v7 | Client-side routing |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Three.js + React Three Fiber + Drei | 3D model rendering |
| GSAP + @gsap/react | Animations |
| @stripe/react-stripe-js + @stripe/stripe-js | Payment Elements |
| Sonner | Toast notifications |
| @sentry/react | Error monitoring |

### Backend

| Library | Purpose |
|---|---|
| Express v5 | HTTP server |
| Prisma ORM + `@prisma/adapter-pg` | Database access via PostgreSQL connection pool |
| pg | PostgreSQL driver / connection pool |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation & verification |
| Stripe Node SDK | Payment Intent creation |
| Resend | Transactional email (OTP) |
| Helmet | Security headers |
| cors | Cross-origin resource sharing |
| compression | Gzip response compression |
| cookie-parser | JWT cookie parsing |

### Database

PostgreSQL managed via Prisma. Models: `User`, `Product`, `ProductVariant`, `CartItem`, `Order`, `OrderItem`, `OrderStatusHistory`, `Address`.

---

## Project Structure

```
apple_website/
├── index.html                  # Vite HTML entry
├── vite.config.js              # Vite + Tailwind + chunk splitting
├── vercel.json                 # Vercel SPA rewrite rule
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── prisma.config.js        # Prisma config
│   └── seed.js                 # Database seed script
├── server/
│   ├── index.js                # Express app entry — CORS, middleware, route mounting
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware (cookie + Authorization header)
│   ├── routes/
│   │   ├── auth.js             # Sign-up, sign-in, sign-out, forgot/reset password, /me
│   │   ├── user.js             # Profile, address CRUD
│   │   ├── products.js         # Product + variant fetch by slug
│   │   ├── cart.js             # Cart CRUD (auth-protected)
│   │   ├── payment.js          # Stripe Payment Intent creation
│   │   ├── orders.js           # Order creation, listing, detail, status update
│   │   └── assets.js           # GLB model proxy (correct MIME type from Cloudinary)
│   └── utils/
│       ├── jwt.js              # Token generation, verification, cookie helpers
│       ├── email.js            # Resend OTP email
│       └── prisma.js           # Prisma client singleton with pg pool adapter
└── src/
    ├── main.jsx                # React entry point + Sentry init
    ├── App.jsx                 # Router, providers, lazy-loaded routes
    ├── instrument.js           # Sentry browser instrumentation
    ├── components/             # Reusable UI (Navbar, Footer, Hero, Model, etc.)
    ├── pages/                  # Route-level page components
    ├── context/
    │   ├── AuthContext.jsx     # Auth state, sign-in/out helpers
    │   └── CartContext.jsx     # Cart state and API calls
    ├── constants/index.js      # Shared static data
    └── utils/                  # Animations, formatting helpers
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted)
- Stripe account
- Resend account (for OTP emails)
- Sentry project (optional — monitoring is disabled outside production)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# ── Backend ──────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-very-strong-secret
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
PORT=5000                          # optional, defaults to 5000

# ── Frontend (Vite — must be prefixed VITE_) ──────────────
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SENTRY_DSN=https://...@sentry.io/...   # optional
```

### 3. Set up the database

```bash
# Push the Prisma schema to your database
npm run db:push

# (Optional) Seed initial product data
npm run db:seed
```

### 4. Run the development servers

```bash
# Start both Vite dev server (port 5173) and Express server (port 5000) concurrently
npm run dev:all

# Or run them separately:
npm run dev       # Vite frontend only
npm run server    # Express backend only
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run server` | Start Express API server |
| `npm run dev:all` | Start both concurrently |
| `npm run build` | `prisma generate` + `vite build` |
| `npm start` | Start Express server (production) |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Run the database seed script |

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require a valid `auth_token` cookie or `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | — | Register a new user |
| `POST` | `/signin` | — | Sign in, sets `auth_token` cookie |
| `POST` | `/signout` | — | Clears `auth_token` cookie |
| `POST` | `/forgot-password` | — | Send OTP to email |
| `POST` | `/reset-password` | — | Verify OTP and update password |
| `GET` | `/me` | ✓ | Return current user object |

### User — `/api/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/profile` | ✓ | Get profile with orders and addresses |
| `PUT` | `/profile` | ✓ | Update name/email |
| `GET` | `/addresses` | ✓ | List saved addresses |
| `POST` | `/addresses` | ✓ | Create a new address |
| `PUT` | `/addresses/:addressId` | ✓ | Update an address |
| `DELETE` | `/addresses/:addressId` | ✓ | Delete an address |

### Products — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/:slug` | — | Get product and all variants by slug |

### Cart — `/api/cart`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✓ | Get cart items for current user |
| `POST` | `/` | ✓ | Add item (or increment quantity) |
| `PUT` | `/:cartItemId` | ✓ | Update item quantity |
| `DELETE` | `/:cartItemId` | ✓ | Remove item |
| `POST` | `/clear` | ✓ | Remove all items from cart |

### Payment — `/api/payment`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/create-payment-intent` | ✓ | Create Stripe Payment Intent; returns `clientSecret` |

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | ✓ | Create order post-payment; optionally saves address |
| `GET` | `/` | ✓ | List all orders for current user |
| `GET` | `/details/:orderId` | ✓ | Get order by UUID (with items, address, history) |
| `GET` | `/:orderNumber` | ✓ | Get order by order number (e.g. `ORD-...`) |
| `PUT` | `/:orderId/status` | ✓ | Update order status (`CONFIRMED` → `SHIPPED` → `DELIVERED` etc.) |

### Assets — `/api/assets`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/scene.glb` | — | Proxy the iPhone GLB model from Cloudinary with correct `model/gltf-binary` MIME type |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "OK", timestamp }` |

---

## Deployment

### Frontend — Vercel

The `vercel.json` rewrites all paths to `/` so React Router handles client-side navigation:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Steps:**
1. Connect the repository to Vercel.
2. Set build command to `npm run build` and output directory to `dist`.
3. Add all `VITE_*` environment variables in the Vercel project settings.

### Backend — Railway (or any Node.js host)

The Express server binds to `0.0.0.0` and reads `PORT` from the environment, which is the expected behaviour for Railway, Render, Fly.io, etc.

**Steps:**
1. Deploy the repository to Railway.
2. Set the start command to `npm start`.
3. Add all backend environment variables: `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`.
4. The production Vercel domain must be added to the `allowedOrigins` array in `server/index.js`.

### Build notes

- `npm run build` runs `prisma generate` before `vite build` to ensure the Prisma client is up-to-date before bundling.
- Console statements and debugger calls are stripped by Terser in production builds.
- Rollup manually splits chunks into `vendor`, `three`, `gsap`, and `payments` to improve caching.