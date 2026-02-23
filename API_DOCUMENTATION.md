# API Documentation

This document provides comprehensive documentation for all API endpoints available in the Apple Website e-commerce platform.

## Base URL

```
Development: http://localhost:5000
Production: [Your production domain]
```

## Authentication

All protected endpoints require a JWT token passed via:
- **Cookie**: `auth_token` (automatic)
- **Header**: `Authorization: Bearer <token>`

Responses indicate authentication errors with status `401 Unauthorized`.

---

## Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "clv123...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGc..."
}
```

**Error Responses**:
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - Email already registered
- `400 Bad Request` - Password does not meet strength requirements

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

### Sign In

Authenticate an existing user.

**Endpoint**: `POST /api/auth/signin`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "clv123...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGc..."
}
```

**Error Responses**:
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid email or password

---

### Get Current User

Retrieve the currently authenticated user's information.

**Endpoint**: `GET /api/auth/me`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
{
  "id": "clv123...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized` - Token expired or invalid

---

### Logout

Clear the user's authentication session.

**Endpoint**: `POST /api/auth/logout`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### Request Password Reset OTP

Send a one-time password (OTP) to the user's email for password reset.

**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "OTP sent to email if account exists"
}
```

**Note**: Response is the same regardless of whether account exists (security practice)

---

### Reset Password with OTP

Reset the password using the OTP sent to email.

**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass456!"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid or expired OTP
- `400 Bad Request` - Password does not meet requirements

---

## User Management Endpoints

### Get User Profile

Retrieve the currently authenticated user's complete profile.

**Endpoint**: `GET /api/user/profile`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
{
  "id": "clv123...",
  "email": "user@example.com",
  "name": "John Doe",
  "addresses": [
    {
      "id": "addr123...",
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "United States",
      "phone": "+1234567890",
      "isDefault": true
    }
  ],
  "orders": [
    {
      "id": "ord123...",
      "orderNumber": "ORD-2024-001",
      "total": 999.99,
      "status": "shipped",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Update User Profile

Update user's name and email.

**Endpoint**: `PUT /api/user/profile`

**Headers**: 
- Authorization required

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response** (200 OK):
```json
{
  "id": "clv123...",
  "email": "jane@example.com",
  "name": "Jane Doe"
}
```

**Error Responses**:
- `400 Bad Request` - Email already in use

---

### Get Saved Addresses

Retrieve all saved addresses for the user.

**Endpoint**: `GET /api/user/addresses`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
[
  {
    "id": "addr123...",
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "United States",
    "phone": "+1234567890",
    "isDefault": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "addr456...",
    "fullName": "John Doe",
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "United States",
    "phone": "+1234567890",
    "isDefault": false,
    "createdAt": "2024-01-16T10:30:00Z"
  }
]
```

---

### Add New Address

Save a new shipping address.

**Endpoint**: `POST /api/user/addresses`

**Headers**: 
- Authorization required

**Request Body**:
```json
{
  "fullName": "John Doe",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "United States",
  "phone": "+1234567890",
  "isDefault": false
}
```

**Response** (201 Created):
```json
{
  "id": "addr789...",
  "fullName": "John Doe",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "United States",
  "phone": "+1234567890",
  "isDefault": false,
  "createdAt": "2024-01-17T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request` - Missing required fields

---

### Update Address

Update an existing address.

**Endpoint**: `PUT /api/user/addresses/:addressId`

**Headers**: 
- Authorization required

**URL Parameters**:
- `addressId` (string, required) - ID of the address to update

**Request Body** (all fields optional):
```json
{
  "fullName": "Jane Doe",
  "phone": "+0987654321"
}
```

**Response** (200 OK):
```json
{
  "id": "addr123...",
  "fullName": "Jane Doe",
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "United States",
  "phone": "+0987654321",
  "isDefault": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `403 Forbidden` - Address does not belong to user
- `404 Not Found` - Address not found

---

### Delete Address

Remove a saved address.

**Endpoint**: `DELETE /api/user/addresses/:addressId`

**Headers**: 
- Authorization required

**URL Parameters**:
- `addressId` (string, required) - ID of the address to delete

**Response** (200 OK):
```json
{
  "message": "Address deleted successfully"
}
```

**Error Responses**:
- `403 Forbidden` - Address does not belong to user
- `404 Not Found` - Address not found

---

## Shopping Cart Endpoints

### Get Cart

Retrieve the user's shopping cart.

**Endpoint**: `GET /api/cart`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
[
  {
    "id": "cart123...",
    "userId": "user123...",
    "productId": "prod123...",
    "variantId": "var123...",
    "product": {
      "id": "prod123...",
      "name": "iPhone 15 Pro",
      "basePrice": 999.99,
      "description": "Latest iPhone model"
    },
    "color": "Titanium Blue",
    "storage": "256GB",
    "price": 1099.99,
    "quantity": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Add to Cart

Add an item to the shopping cart.

**Endpoint**: `POST /api/cart`

**Headers**: 
- Authorization required

**Request Body**:
```json
{
  "productId": "prod123...",
  "quantity": 1,
  "variantId": "var123..." // Optional
}
```

**Response** (200 OK):
```json
{
  "id": "cart123...",
  "userId": "user123...",
  "productId": "prod123...",
  "variantId": "var123...",
  "color": "Titanium Blue",
  "storage": "256GB",
  "price": 1099.99,
  "quantity": 1,
  "product": {
    "id": "prod123...",
    "name": "iPhone 15 Pro",
    "basePrice": 999.99
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing productId or quantity
- `404 Not Found` - Product not found
- `400 Bad Request` - Invalid product variant

---

### Update Cart Item Quantity

Update the quantity of an item in the cart.

**Endpoint**: `PUT /api/cart/:cartItemId`

**Headers**: 
- Authorization required

**URL Parameters**:
- `cartItemId` (string, required) - ID of the cart item

**Request Body**:
```json
{
  "quantity": 2
}
```

**Response** (200 OK):
```json
{
  "id": "cart123...",
  "userId": "user123...",
  "productId": "prod123...",
  "quantity": 2,
  "price": 1099.99,
  "product": {
    "id": "prod123...",
    "name": "iPhone 15 Pro"
  }
}
```

---

### Remove from Cart

Remove an item from the shopping cart.

**Endpoint**: `DELETE /api/cart/:cartItemId`

**Headers**: 
- Authorization required

**URL Parameters**:
- `cartItemId` (string, required) - ID of the cart item to remove

**Response** (200 OK):
```json
{
  "message": "Item removed from cart"
}
```

---

### Clear Cart

Remove all items from the shopping cart.

**Endpoint**: `DELETE /api/cart`

**Headers**: 
- Authorization required

**Response** (200 OK):
```json
{
  "message": "Cart cleared successfully"
}
```

---

## Product Endpoints

### Get Product Details

Retrieve detailed information about a specific product.

**Endpoint**: `GET /api/products/:slug`

**URL Parameters**:
- `slug` (string, required) - Product URL slug (e.g., "iphone-15-pro")

**Response** (200 OK):
```json
{
  "id": "prod123...",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "description": "Latest iPhone with advanced features",
  "basePrice": 999.99,
  "image": "/images/iphone-15-pro.jpg",
  "category": "Smartphones",
  "inStock": true,
  "variants": [
    {
      "id": "var123...",
      "color": "Titanium Blue",
      "storage": "256GB",
      "size": null,
      "price": 1099.99,
      "stock": 50
    },
    {
      "id": "var456...",
      "color": "Titanium Black",
      "storage": "512GB",
      "size": null,
      "price": 1199.99,
      "stock": 30
    }
  ]
}
```

**Error Responses**:
- `404 Not Found` - Product not found

---

## Order Endpoints

### Create Order

Create a new order after payment processing.

**Endpoint**: `POST /api/orders/create`

**Headers**: 
- Authorization required
- Content-Type: application/json

**Request Body**:
```json
{
  "items": [
    {
      "id": "cart123...",
      "productId": "prod123...",
      "quantity": 1,
      "price": 1099.99
    }
  ],
  "total": 1188.77,
  "shippingInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "United States"
  },
  "paymentIntentId": "pi_123456789",
  "saveAddress": true
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "order": {
    "id": "ord123...",
    "userId": "user123...",
    "orderNumber": "ORD-2024-001",
    "items": [
      {
        "id": "oi123...",
        "productId": "prod123...",
        "quantity": 1,
        "price": 1099.99
      }
    ],
    "total": 1188.77,
    "status": "pending",
    "paymentIntentId": "pi_123456789",
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "San Francisco"
    },
    "createdAt": "2024-01-18T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid order data

---

### Get Order by ID

Retrieve details of a specific order.

**Endpoint**: `GET /api/orders/:orderId`

**Headers**: 
- Authorization required

**URL Parameters**:
- `orderId` (string, required) - ID of the order

**Response** (200 OK):
```json
{
  "id": "ord123...",
  "userId": "user123...",
  "orderNumber": "ORD-2024-001",
  "items": [
    {
      "id": "oi123...",
      "product": {
        "name": "iPhone 15 Pro",
        "image": "/images/iphone-15-pro.jpg"
      },
      "quantity": 1,
      "price": 1099.99
    }
  ],
  "total": 1188.77,
  "status": "processing",
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105"
  },
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2024-01-18T10:30:00Z",
      "notes": "Order received"
    },
    {
      "status": "processing",
      "timestamp": "2024-01-18T11:00:00Z",
      "notes": "Processing payment"
    }
  ],
  "createdAt": "2024-01-18T10:30:00Z"
}
```

**Error Responses**:
- `403 Forbidden` - Order does not belong to user
- `404 Not Found` - Order not found

---

### Get User's Orders

Retrieve all orders for the authenticated user.

**Endpoint**: `GET /api/orders`

**Headers**: 
- Authorization required

**Query Parameters**:
- `page` (integer, optional) - Pagination page number (default: 1)
- `limit` (integer, optional) - Items per page (default: 10)
- `status` (string, optional) - Filter by status (pending, processing, shipped, delivered)

**Response** (200 OK):
```json
[
  {
    "id": "ord123...",
    "orderNumber": "ORD-2024-001",
    "total": 1188.77,
    "status": "shipped",
    "createdAt": "2024-01-18T10:30:00Z"
  },
  {
    "id": "ord456...",
    "orderNumber": "ORD-2024-002",
    "total": 599.99,
    "status": "delivered",
    "createdAt": "2024-01-19T14:20:00Z"
  }
]
```

---

### Update Order Status

Update the status of an order (admin/testing endpoint).

**Endpoint**: `PUT /api/orders/:orderId/status`

**Headers**: 
- Authorization required

**URL Parameters**:
- `orderId` (string, required) - ID of the order

**Request Body**:
```json
{
  "status": "shipped",
  "notes": "Package dispatched"
}
```

**Response** (200 OK):
```json
{
  "id": "ord123...",
  "status": "shipped",
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2024-01-18T10:30:00Z"
    },
    {
      "status": "shipped",
      "timestamp": "2024-01-18T15:30:00Z",
      "notes": "Package dispatched"
    }
  ]
}
```

---

## Payment Endpoints

### Create Payment Intent

Create a Stripe payment intent for order checkout.

**Endpoint**: `POST /api/payment/create-intent`

**Headers**: 
- Authorization required
- Content-Type: application/json

**Request Body**:
```json
{
  "amount": 1188.77,
  "currency": "usd"
}
```

**Response** (200 OK):
```json
{
  "clientSecret": "pi_123456789_secret_123456789",
  "publishableKey": "pk_test_123456789"
}
```

**Error Responses**:
- `400 Bad Request` - Missing amount or currency
- `400 Bad Request` - Invalid amount
- `500 Internal Server Error` - Stripe API error

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently not implemented but can be added using express-rate-limit middleware.

---

## CORS

CORS is enabled for the configured CLIENT_URL. Requests from other origins will be rejected.

---

## Response Format

All successful responses return properly formatted JSON with appropriate HTTP status codes.

---

**API Version**: 1.0  
**Last Updated**: February 2026
