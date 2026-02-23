# Complete E-Commerce Setup - All Missing Files

## 🐛 Issues Fixed:

1. ✅ **CSS Class Bugs** - `bg-linear-to-r/b` → `bg-gradient-to-r/b`
2. ✅ **Wrong Route Param** - `orderId` → `orderNumber`
3. ✅ **Wrong API Endpoint** - `/api/orders/details/${orderId}` → `/api/orders/${orderNumber}`
4. ✅ **Missing Backend** - Complete server with all routes created
5. ✅ **GSAP Animations** - Fixed with `clearProps: 'all'`
6. ✅ **Session Management** - Added express-session for auth

---

## 📦 Files You Need:

### 1. Backend Server ✅
**File:** `server/server.js`
**What it does:**
- Product routes (get all, get by slug)
- Cart routes (CRUD operations)
- Order routes (create, get, update status)
- Auth routes (login, logout, session)

### 2. Fixed OrderTrackingPage ✅
**File:** `src/pages/OrderTrackingPage.jsx`
**Fixes:**
- Uses `orderNumber` param
- Correct API endpoint
- Fixed CSS classes
- GSAP animations work

### 3. Package.json Dependencies ✅
Need to install:
```bash
npm install express cors dotenv cookie-parser express-session @prisma/client
```

---

## 🚀 Complete Setup Steps:

### Step 1: Install Backend Dependencies
```bash
npm install express cors dotenv cookie-parser express-session
```

### Step 2: Create Server File
```bash
# Copy server.js to your project
cp server.js server/server.js
```

### Step 3: Update package.json Scripts
Add to your `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/server.js",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\"",
    "build": "vite build"
  }
}
```

### Step 4: Install Concurrently (Optional)
```bash
npm install -D concurrently
```

### Step 5: Replace OrderTrackingPage
```bash
cp OrderTrackingPage_complete.jsx src/pages/OrderTrackingPage.jsx
```

### Step 6: Update Your .env
Make sure you have:
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Database
DATABASE_URL="..."
DIRECT_URL="..."

# Frontend (VITE_API_URL)
VITE_API_URL=http://localhost:5000
```

### Step 7: Start Everything
```bash
# Option 1: Two terminals
# Terminal 1
npm run server

# Terminal 2
npm run dev

# Option 2: One terminal (if you installed concurrently)
npm run dev:full
```

---

## 🎯 API Endpoints Created:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug with variants

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all user orders
- `GET /api/orders/:orderNumber` - Get specific order
- `PATCH /api/orders/:orderNumber/status` - Update order status

### Auth (Session-based)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

---

## 🔧 How Authentication Works:

The server uses **express-session** for authentication:

1. **Login** → Creates session → Stores `userId` in `req.session`
2. **Protected Routes** → Check `req.session.userId`
3. **Logout** → Destroys session

### Important Notes:
- Sessions are server-side (more secure than JWT for this use case)
- Cookie is HTTP-only (prevents XSS attacks)
- CORS is configured with `credentials: true`
- All fetch requests must include `credentials: 'include'`

---

## 📋 Complete Flow Test:

### 1. Start Servers
```bash
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

### 2. Visit Product Page
```
http://localhost:5173/product/iphone-15-pro
```

### 3. Select Options
- Choose color
- Choose size
- Set quantity

### 4. Add to Cart
- Click "Add to Cart"
- OR click "Buy Now" (adds to cart + redirects)

### 5. View Cart
```
http://localhost:5173/cart
```

### 6. Checkout
- Fill shipping info
- Complete payment
- Order is created

### 7. Track Order
```
http://localhost:5173/orders/ORD-1234567890-XXXXX
```

### 8. Test Status Update
- Click "Advance Status" button
- Watch progress bar animate
- Timeline updates in real-time

---

## 🐛 Troubleshooting:

### Issue: "Cannot connect to server"
**Solution:**
```bash
# Check server is running
curl http://localhost:5000/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Issue: "401 Unauthorized"
**Solution:**
- Make sure you're signed in
- Check session cookie exists (DevTools → Application → Cookies)
- Restart server (sessions are lost on restart)

### Issue: "Order not found"
**Solution:**
- Check orderNumber in URL
- Make sure you're using the correct user account
- Check database: `npx prisma studio`

### Issue: "GSAP animations not working"
**Solution:**
- Make sure GSAP is installed: `npm install gsap @gsap/react`
- Check `clearProps: 'all'` is in animation config
- Verify elements aren't hidden by CSS

### Issue: "CSS classes not working"
**Solution:**
- Changed `bg-linear-to-r` → `bg-gradient-to-r`
- Changed `bg-linear-to-b` → `bg-gradient-to-b`
- Restart dev server after changes

---

## 📊 Database Schema Changes Needed:

The server expects this schema (already in your schema.prisma):

```prisma
model Order {
  orderNumber   String      @unique  // ✅ Required
  userId        String                // ✅ Required
  total         Decimal                // ✅ Required
  subtotal      Decimal?               // Optional
  tax           Decimal?               // Optional
  shipping      Decimal?               // Optional
  status        OrderStatus            // ✅ Required
  paymentStatus PaymentStatus          // ✅ Required
  items         OrderItem[]            // ✅ Required
  shippingAddress Address?             // ✅ Required
  statusHistory OrderStatusHistory[]   // ✅ Required
}
```

If your schema is different, run:
```bash
npx prisma db push
```

---

## ✅ Testing Checklist:

- [ ] Server starts on port 5000
- [ ] Frontend starts on port 5173
- [ ] Can view product detail page
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Can create order
- [ ] Order tracking page loads
- [ ] Can advance order status
- [ ] Progress bar animates correctly
- [ ] All GSAP animations work
- [ ] No CSS errors in console
- [ ] No CORS errors

---

## 🎉 You're Done!

Once all steps are complete:
1. Products load ✅
2. Cart works ✅
3. Orders created ✅
4. Tracking works ✅
5. Status updates ✅

**Time to complete:** ~20 minutes
**Difficulty:** Intermediate
