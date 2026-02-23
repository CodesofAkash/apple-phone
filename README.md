# Apple Website - E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, Stripe integration, and Prisma ORM. This project replicates a premium Apple-like shopping experience with advanced features including product catalog, cart management, secure checkout, and order tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Environment Variables](#environment-variables)

## Features

### Core E-Commerce
- **Product Catalog**: Browse and filter products with detailed specifications and variants
- **Shopping Cart**: Add/remove items with real-time quantity management
- **Wishlist Integration**: Save favorite items for later
- **Product Variants**: Support for multiple colors, storage, and size options
- **Dynamic Pricing**: Variant-specific pricing with tax calculation

### User Management
- **User Authentication**: Secure signup/signin with JWT tokens
- **Profile Management**: Update user information and preferences
- **Address Management**: Save multiple shipping addresses
- **Order History**: View past orders and tracking information
- **Session Management**: Automatic session expiry handling with notifications

### Shopping & Checkout
- **Secure Payment**: Stripe integration for credit/debit card payments
- **Address Validation**: Validate and save shipping addresses
- **Tax Calculation**: Automatic tax calculation (8% IST)
- **Order Confirmation**: Email confirmations with order details
- **Order Tracking**: Real-time order status updates

### Security
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication with expiry
- **CORS Protection**: Configured for development and production
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Rate Limiting Ready**: Infrastructure for implementing rate limiting
- **Secure Cookies**: HttpOnly, Secure, and SameSite cookie flags

### Performance
- **Image Optimization**: Lazy loading and optimized image delivery
- **API Caching**: Response caching for frequently accessed data
- **Code Splitting**: React lazy loading for routes
- **Compression**: Gzip compression for API responses
- **Performance Monitoring**: Web Vitals tracking

### UI/UX
- **Smooth Animations**: GSAP-powered animations for visual polish
- **Responsive Design**: Mobile-first design approach
- **Dark Theme**: Premium dark interface with glassmorphism effects
- **Toast Notifications**: Non-intrusive user feedback with Sonner
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

## Tech Stack

### Frontend
- **React 18+** - UI framework with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript/JavaScript** - Type safety and flexibility
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **GSAP** - Advanced animations
- **Stripe.js** - Payment handling
- **Sonner** - Toast notifications
- **Axios/Fetch API** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database abstraction layer
- **jwt** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration

### Database
- **PostgreSQL** - Primary database (via Prisma Studio/Prisma Postgres)
- **Prisma Client** - Database client with migrations

### External Services
- **Stripe** - Payment processing
- **Nodemailer/Email Service** - OTP and notifications

## Prerequisites

Before you begin, ensure you have installed:
- Node.js v16+ and npm v8+
- Git
- PostgreSQL 12+ (or access to Prisma Postgres)
- Stripe account (for payment integration)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apple_website
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Set Up Environment Variables

Create `.env` file in the root directory:

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

Create `server/.env` file:

```bash
# Backend (.env)
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/apple_website
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLIENT_URL=http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Create/migrate database
npm run db:migrate

# (Optional) Seed database with sample data
npm run db:seed
```

## Configuration

### Environment Configuration

All configuration is managed through environment variables. See [Environment Variables](#environment-variables) section for complete list.

### Database Configuration

Database is configured through `DATABASE_URL`. For development, use:
- Local PostgreSQL: `postgresql://user:password@localhost:5432/db_name`
- Prisma Postgres: Use hosted connection string from console.prisma.io

### CORS Configuration

CORS is configured in `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))
```

## Running the Project

### Development Mode

#### Terminal 1 - Frontend (runs on http://localhost:5173)
```bash
npm run dev
```

#### Terminal 2 - Backend (runs on http://localhost:5000)
```bash
cd server
npm start
```

### Build for Production

```bash
# Build frontend
npm run build

# Creates optimized build in dist/ folder
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
apple_website/
├── src/                           # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Navbar.jsx           # Navigation component
│   │   ├── Footer.jsx           # Footer component
│   │   ├── ErrorBoundary.jsx    # Error handling wrapper
│   │   └── ...
│   ├── pages/                    # Page components (routes)
│   │   ├── HomePage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── SigninPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── ...
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── CartContext.jsx       # Shopping cart state
│   ├── utils/                    # Utility functions
│   │   ├── cache.js             # API caching
│   │   ├── imageOptimization.js # Image optimization
│   │   └── ...
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # Global styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Base styles
├── server/                        # Backend source code
│   ├── routes/                   # API route handlers
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── user.js              # User management
│   │   ├── cart.js              # Shopping cart
│   │   ├── products.js          # Product catalog
│   │   ├── orders.js            # Order management
│   │   └── payment.js           # Payment processing
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT verification
│   ├── utils/                   # Server utilities
│   │   ├── jwt.js              # Token generation/verification
│   │   ├── prisma.js           # Prisma client
│   │   └── email.js            # Email service
│   └── index.js                 # Server entry point
├── prisma/                       # Database configuration
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.js                  # Sample data
├── public/                       # Static files
│   ├── service-worker.js
│   ├── manifest.json
│   └── assets/
├── vite.config.js               # Vite configuration
├── package.json                 # Frontend dependencies
└── server/package.json          # Backend dependencies
```

## API Documentation

Full API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Reference

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/addresses` - List saved addresses
- `POST /api/user/addresses` - Add new address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

#### Shopping
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

#### Products
- `GET /api/products/:slug` - Get product details with variants

#### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - List user's orders
- `PUT /api/orders/:id/status` - Update order status

#### Payments
- `POST /api/payment/create-intent` - Create Stripe payment intent

## Database Schema

The database uses PostgreSQL with the following main tables:

- **User** - User accounts with authentication
- **Product** - Product catalog
- **ProductVariant** - Product variants (color, storage, size)
- **CartItem** - Shopping cart items
- **Order** - Order history
- **OrderItem** - Items in each order
- **OrderStatusHistory** - Order status timeline
- **Address** - Saved shipping addresses

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed schema documentation.

## Authentication

### Flow
1. User signs up with email and strong password
2. Password is hashed with bcryptjs (10 rounds)
3. JWT token is generated with 6-hour expiry
4. Token stored in HttpOnly cookie
5. Subsequent requests include token in Authorization header

### Password Requirements
- Minimum 8 characters
- Must include uppercase and lowercase letters
- Must include numbers and special characters
- Verified via strength check function

### Session Management
- Sessions expire after 6 hours
- Expired sessions trigger re-authentication
- Token refresh available on specific endpoints

## Payment Integration

### Stripe Setup
1. Create Stripe account at stripe.com
2. Get publishable key and secret key
3. Add keys to environment variables
4. Stripe Elements for secure card input
5. Server-side payment intent creation

### Checkout Flow
1. User fills shipping information
2. Card details collected via Stripe Elements
3. Payment intent created on server
4. Payment processed through Stripe
5. Order created upon successful payment
6. Confirmation email sent

## Performance Optimization

### Frontend
- **Code Splitting**: Routes loaded on demand with React.lazy
- **Image Optimization**: Lazy loading images for faster page load
- **Caching**: API responses cached for 5 minutes
- **Compression**: Gzip compression for API responses
- **CSS Optimization**: TailwindCSS with PurgeCSS

### Backend
- **Database Indexing**: Efficient indexes on frequently queried fields
- **Connection Pooling**: Prisma handles connection optimization
- **Response Caching**: Strategic caching of product catalog
- **Error Handling**: Graceful error responses

## Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy dist folder to your hosting service
```

### Backend Deployment (Heroku/Railway/Render)

```bash
# Push to git repository
git push heroku main

# Or use platform-specific deployment tools
```

### Environment Variable Setup
Set all environment variables in your hosting platform's dashboard.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Environment Variables

### Frontend (.env)
```
VITE_API_URL              - Backend API URL (default: http://localhost:5000)
VITE_STRIPE_PUBLISHABLE_KEY - Stripe publishable key for payments
```

### Backend (.env)
```
PORT                      - Server port (default: 5000)
NODE_ENV                  - Environment (development/production)
DATABASE_URL             - PostgreSQL connection string
JWT_SECRET               - Secret key for JWT signing
JWT_EXPIRY               - Token expiry time (default: 6h)
STRIPE_SECRET_KEY        - Stripe secret key for payment processing
CLIENT_URL               - Frontend URL for CORS (default: http://localhost:5173)
EMAIL_SERVICE            - Email service provider (gmail, etc.)
EMAIL_USER               - Email sender address
EMAIL_PASSWORD           - Email service password/token
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database user has proper permissions

### Payment Not Working
- Verify Stripe keys in environment variables
- Check Stripe publishable key matches secret key
- Test with Stripe's test card numbers

### Authentication Errors
- Clear cookies and local storage
- Verify JWT_SECRET is set correctly
- Check token expiry settings

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

## License

[Specify your license here]

## Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Last Updated**: February 2026
**Maintained By**: Development Team
