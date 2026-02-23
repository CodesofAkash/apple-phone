# Architecture & Project Structure Documentation

This document provides an in-depth explanation of the project architecture, design patterns, and structural organization.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Layers](#architecture-layers)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Directory Structure Guide](#directory-structure-guide)

## Project Overview

This is a full-stack e-commerce platform built with a clear separation of concerns:

- **Frontend**: React-based SPA (Single Page Application) with client-side routing
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Prisma ORM
- **External Services**: Stripe for payments, Email service for notifications

The architecture follows industry best practices including:
- Component-based UI architecture
- RESTful API design
- Model-View-Controller (MVC) pattern on the backend
- Context API for state management
- Middleware-based request handling

## Architecture Layers

```
┌─────────────────────────────────────────┐
│     Frontend (React SPA)                │
│  ├─ UI Components                      │
│  ├─ Pages & Routing                    │
│  ├─ State Management (Context)         │
│  └─ Utilities & Services               │
├─────────────────────────────────────────┤
│     API Layer (REST)                    │
│  ├─ HTTP/HTTPS                         │
│  ├─ JSON Request/Response              │
│  └─ Authentication Headers             │
├─────────────────────────────────────────┤
│     Backend (Express.js Server)         │
│  ├─ Route Handlers                     │
│  ├─ Middleware                         │
│  ├─ Business Logic                     │
│  └─ External Service Integration       │
├─────────────────────────────────────────┤
│     Data Access Layer (Prisma ORM)      │
│  ├─ Database Queries                   │
│  ├─ Migrations                         │
│  └─ Schema Definition                  │
├─────────────────────────────────────────┤
│     Database (PostgreSQL)               │
│  ├─ Relational Data Storage            │
│  ├─ Indexes & Constraints              │
│  └─ Data Persistence                   │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

```
Components/
├─ Layout Components
│  ├─ Navbar.jsx          - Main navigation
│  ├─ Footer.jsx          - Footer component
│  └─ ErrorBoundary.jsx   - Error handling wrapper
├─ Feature Components
│  ├─ Hero.jsx            - Landing hero section
│  ├─ Features.jsx        - Product features showcase
│  ├─ Highlights.jsx      - Key highlights
│  ├─ VideoCarousel.jsx   - Video showcase
│  └─ HowItWorks.jsx      - Instructions/flow
├─ UI Components
│  ├─ Loader.jsx          - Loading indicator
│  ├─ SimpleLoader.jsx    - Minimal loader
│  ├─ BlockedTokenModal.jsx - Session expiry modal
│  ├─ IPhone.jsx          - Product display
│  ├─ Model.jsx           - 3D model viewer
│  ├─ ModelView.jsx       - Model controls
│  └─ Lights.jsx          - Lighting effects
```

### State Management Architecture

```
AuthContext
├─ user state
├─ isAuthenticated
├─ loading
├─ sessionExpired
├─ signup()
├─ signin()
├─ logout()
├─ resetPassword()
└─ dismissSessionModal()

CartContext
├─ cart state (CartItem[])
├─ user reference
├─ getCartTotal()
├─ addToCart()
├─ removeFromCart()
├─ updateCartQuantity()
└─ clearCart()
```

### Routing Architecture

```
App.jsx (Router wrapper)
├─ / (HomePage)
├─ /signin (SigninPage)
├─ /signup (SignupPage)
├─ /forgot-password (ForgotPasswordPage)
├─ /contact (ContactPage)
├─ /about (AboutPage)
├─ /products/:slug (ProductDetailPage)
├─ /cart (CartPage)
├─ /checkout (CheckoutPage)
├─ /orders (OrdersPage)
├─ /orders/:orderId (OrderDetailsPage)
├─ /orders/:orderId/track (OrderTrackingPage)
├─ /privacy-policy (PrivacyPolicyPage)
├─ /terms-of-use (TermsOfUsePage)
├─ /sales-policy (SalesPolicyPage)
└─ /sitemap (SiteMapPage)
```

### API Communication Pattern

```
Component
  ↓
useAuth/useCart Hook
  ↓
fetch() or axios request
  ↓
API Endpoint (/api/...)
  ↓
Response handling
  ↓
State update
  ↓
Re-render with data
```

## Backend Architecture

### Request Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
JSON Parser
    ↓
Cookie Parser
    ↓
Compression Middleware
    ↓
Route Matching
    ↓
Authentication Middleware (if required)
    ↓
Route Handler Function
    ↓
Business Logic
    ↓
Prisma ORM Query
    ↓
Database
    ↓
Response JSON
    ↓
HTTP Response
```

### API Structure

```
server/
├─ routes/
│  ├─ auth.js          - Authentication routes (signup, signin, password reset)
│  ├─ user.js          - User profile and address management
│  ├─ cart.js          - Shopping cart operations
│  ├─ products.js      - Product catalog endpoints
│  ├─ orders.js        - Order management (create, list, track)
│  └─ payment.js       - Payment intent creation
├─ middleware/
│  └─ auth.js          - JWT token verification middleware
├─ utils/
│  ├─ jwt.js           - Token generation and verification
│  ├─ prisma.js        - Prisma client instance
│  ├─ email.js         - Email service
│  └─ errorHandler.js  - Error handling utilities
└─ index.js            - Server initialization
```

### Middleware Stack

1. **Helmet** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Compression** - Gzip compression
4. **JSON Body Parser** - Parse JSON requests
5. **Cookie Parser** - Parse cookies
6. **Security Headers** - Custom security headers
7. **Auth Middleware** - JWT verification (on protected routes)

### Error Handling Pattern

```javascript
try {
  // Business logic
  const result = await prisma.user.findUnique(...)
  
  if (!result) {
    return res.status(404).json({ error: 'Not found' })
  }
  
  res.json(result)
} catch (error) {
  console.error('Operation error:', error)
  res.status(500).json({ error: 'Operation failed' })
}
```

## Database Schema

### Entity Relationship Diagram

```
User (1) ──────── (N) Address
 │
 ├─ (1) ─────────── (N) CartItem
 │
 ├─ (1) ─────────── (N) Order
 │                    │
 │                    ├─ (1) ─────────── (N) OrderItem
 │                    │
 │                    └─ (1) ─────────── (N) OrderStatusHistory
 │
 └─ (1) ─────────── (N) PasswordResetOTP

Product (1) ─────────── (N) ProductVariant
             (1) ─────────── (N) OrderItem
             (1) ─────────── (N) CartItem
```

### Table Relationships

#### User Table
```prisma
User {
  id                    String       @id @default(cuid())
  email                 String       @unique
  password              String       (hashed)
  name                  String
  addresses             Address[]    (One-to-Many)
  cartItems             CartItem[]   (One-to-Many)
  orders                Order[]      (One-to-Many)
  resetOtp              String?
  resetOtpExpires       DateTime?
}
```

#### Product Table
```prisma
Product {
  id                    String       @id @default(cuid())
  name                  String
  slug                  String       @unique
  description           String
  basePrice             Float
  category              String
  inStock               Boolean
  image                 String
  variants              ProductVariant[]   (One-to-Many)
  cartItems             CartItem[]        (One-to-Many)
  orderItems            OrderItem[]       (One-to-Many)
}
```

#### Order Table
```prisma
Order {
  id                    String       @id @default(cuid())
  userId                String
  user                  User         @relation(fields: [userId])
  orderNumber           String       @unique
  items                 OrderItem[]  (One-to-Many)
  total                 Float
  status                String       (enum: pending, processing, shipped, delivered)
  paymentIntentId       String
  shippingAddress       Address?
  statusHistory         OrderStatusHistory[] (One-to-Many)
}
```

## Authentication Flow

### Signup Flow

```
1. User submits signup form
   ↓
2. Frontend validates password strength
   ↓
3. POST /api/auth/signup with email, password, name
   ↓
4. Backend validates input
   ↓
5. Check if email already exists
   ↓
6. Hash password with bcryptjs (10 rounds)
   ↓
7. Create user in database
   ↓
8. Generate JWT token (6h expiry)
   ↓
9. Set token in HttpOnly cookie
   ↓
10. Return user data and token
   ↓
11. Frontend stores token
   ↓
12. Redirect to home page
```

### Signin Flow

```
1. User submits signin form
   ↓
2. POST /api/auth/signin with email, password
   ↓
3. Backend finds user by email
   ↓
4. If no user: return 401
   ↓
5. Compare passwords using bcrypt
   ↓
6. If invalid: return 401
   ↓
7. Generate JWT token (6h expiry)
   ↓
8. Set token in HttpOnly cookie
   ↓
9. Return user data and token
   ↓
10. Frontend authenticates and redirects
```

### Protected Route Access

```
1. Frontend makes authenticated request
   ↓
2. Token included in:
   - Cookie (automatic)
   - Authorization header
   ↓
3. Backend receives request
   ↓
4. authMiddleware verifies JWT signature
   ↓
5. Extract userId from token
   ↓
6. If valid: attach userId to req object
   ↓
7. If invalid/expired: return 401
   ↓
8. Route handler proceeds with userId
```

## Data Flow

### Add to Cart Flow

```
User clicks "Add to Cart"
    ↓
Component calls addToCart(productId, quantity)
    ↓
POST /api/cart with productId, quantity
    ↓
Backend verifies product exists
    ↓
Check if variant exists (if specified)
    ↓
Check if item already in cart
    ↓
If exists: update quantity
If not: create new CartItem
    ↓
Return updated cart item
    ↓
Frontend updates CartContext
    ↓
Components re-render with new cart
```

### Checkout Flow

```
User clicks "Checkout"
    ↓
Frontend loads saved addresses
    ↓
User enters/selects shipping address
    ↓
Create Stripe PaymentIntent
    ↓
POST /api/payment/create-intent
    ↓
Backend creates intent with amount
    ↓
User enters card details (Stripe Elements)
    ↓
Confirm payment on frontend
    ↓
POST /api/orders/create
    ↓
Backend verifies payment
    ↓
Create Order with OrderItems
    ↓
Save address if requested
    ↓
Create OrderStatusHistory entry
    ↓
Clear cart
    ↓
Send confirmation email
    ↓
Redirect to order confirmation page
```

## Design Patterns

### 1. Context Provider Pattern

Used for global state management:

```javascript
// Create context
const AuthContext = createContext()

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

// Create custom hook
export const useAuth = () => useContext(AuthContext)
```

### 2. Component Composition Pattern

Breaking down complex UIs:

```javascript
// Page component composes multiple feature components
<HomePage>
  <Hero />
  <Features />
  <Highlights />
  <VideoCarousel />
  <HowItWorks />
</HomePage>
```

### 3. Middleware Pattern

Request processing pipeline:

```javascript
app.use(middleware1)
app.use(middleware2)
app.use(authMiddleware) // Only for specific routes
app.get('/api/protected', authMiddleware, handler)
```

### 4. MVC Pattern

Backend organization:

```
Routes (Controller)  →  Business Logic  →  Prisma (Model)
        ↓
   req/res handling
   route matching
   request validation
```

### 5. Single Responsibility Principle

Each file/component has one main responsibility:

```
- ComponentName.jsx: Render UI
- useAuth hook: Manage auth state
- auth.js route: Handle auth endpoints
- jwt.js utility: Token operations
```

## Directory Structure Guide

### Frontend (`src/`)

#### `components/`
Reusable UI components that don't have their own routes.

**Key files**:
- `Navbar.jsx` - Main navigation with menu
- `Footer.jsx` - Footer with links
- `ErrorBoundary.jsx` - Error handling wrapper for entire app
- `BlockedTokenModal.jsx` - Session expiry notification

#### `pages/`
Route-level components that represent full pages.

**Key files**:
- `HomePage.jsx` - Landing page
- `CartPage.jsx` - Shopping cart display
- `CheckoutPage.jsx` - Payment page with Stripe
- `SigninPage.jsx` - User login
- `SignupPage.jsx` - User registration
- `OrderDetailsPage.jsx` - Order information

#### `context/`
React Context for state management.

**Key files**:
- `AuthContext.jsx` - User authentication state
- `CartContext.jsx` - Shopping cart state

#### `utils/`
Helper functions and utilities.

**Key files**:
- `cacheManager.js` - API response caching
- `imageOptimization.js` - Image loading optimization
- `performanceMonitor.js` - Web Vitals tracking
- `seoUtils.js` - SEO helper functions
- `animations.js` - Animation utilities
- `index.js` - Common utilities (formatters, validators)

#### `constants/`
Configuration constants and static data.

**Files**:
- `index.js` - Global constants, API endpoints, configuration

### Backend (`server/`)

#### `routes/`
API endpoint handlers organized by feature.

**Key files**:
- `auth.js` - Authentication endpoints (signup, signin, password reset)
- `user.js` - User profile and address management
- `cart.js` - Shopping cart API
- `products.js` - Product catalog API
- `orders.js` - Order management API
- `payment.js` - Payment processing API

#### `middleware/`
Express middleware functions.

**Key files**:
- `auth.js` - JWT verification middleware
- Validates tokens and extracts userId

#### `utils/`
Helper functions and services.

**Key files**:
- `jwt.js` - Token generation, verification, cookie setting
- `prisma.js` - Prisma client instance (singleton)
- `email.js` - Email service integration
- `errorHandler.js` - Error handling utilities

#### `index.js`
Server entry point that:
1. Loads environment variables
2. Initializes middleware stack
3. Registers route handlers
4. Starts HTTP server

### Database (`prisma/`)

#### `schema.prisma`
Prisma schema definition with:
- Model definitions
- Field types and validations
- Relations between models
- Database configuration

#### `migrations/`
Version-controlled database schema changes.

Each migration folder contains:
- `migration.sql` - SQL commands
- `migration_lock.toml` - Lock file

#### `seed.js`
Script to populate database with sample data.

Used for development and testing.

### Configuration Files

**Root level**:
- `.env` - Frontend environment variables
- `.env.local` - Local overrides (git ignored)
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - TailwindCSS configuration
- `eslint.config.js` - ESLint rules

**Server level**:
- `server/.env` - Backend environment variables
- `server/package.json` - Backend dependencies

## Performance Considerations

### Frontend
- **Code Splitting**: Routes loaded on demand with React.lazy()
- **Image Optimization**: Lazy loading for product images
- **Caching**: 5-minute cache for API responses
- **Bundle Size**: Tree-shaking removes unused code

### Backend
- **Database Indexes**: On frequently queried fields (email, userId)
- **Connection Pooling**: Prisma manages connections
- **Response Compression**: Gzip for all responses
- **Error Handling**: Graceful degradation on failures

## Scalability Considerations

### Current Architecture Limitations
- Single server instance
- In-memory caching
- Direct database calls

### Future Improvements
- Load balancing with multiple server instances
- Redis for distributed caching
- Read replicas for database scaling
- Separate file storage (S3) for images
- Queue system for async operations
- API rate limiting

## Security Considerations

### Implemented
- Password hashing with bcryptjs
- JWT token-based authentication
- HttpOnly, Secure cookies
- CORS with specific origins
- SQL injection prevention (Prisma ORM)
- Input validation
- Error message sanitization

### Recommended Enhancements
- HTTPS/TLS in production
- API rate limiting
- Request body size limits
- Security headers (HSTS, CSP)
- Regular dependency updates
- Input sanitization layer
- Audit logging

---

**Last Updated**: February 2026  
**Architecture Version**: 1.0
