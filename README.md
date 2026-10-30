# HotelPro — Full-Stack Hotel Management & Reservation Platform

HotelPro is a comprehensive, production-oriented hospitality management and online reservation web platform built on the **MERN** stack (MongoDB, Express.js, React 18 with Vite, and Node.js 20+ LTS).

The platform coordinates the hospitality lifecycle across four distinct roles:
1. **Guests**: Discover hotels, check live room availability, book with guaranteed authoritative pricing, make secure payments, view itemized tax invoices, submit stay reviews, and request in-room hotel services.
2. **Hotel Staff**: Process arrivals, handle room check-ins, manage departures, execute check-outs with automatic housekeeping dispatch, and fulfill guest service requests.
3. **Hotel Managers**: Oversee occupancy and revenue analytics, configure suite categories and nightly rates, govern room inventory, and manage assigned staff.
4. **Platform Administrators**: Supervise global multi-hotel approvals, manage platform user accounts, monitor system-wide financials, and review security audit logs.

---

## 1. Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Bootstrap 5, Lucide-React Icons, Recharts, React-Toastify, Axios.
- **Backend**: Node.js 20+ LTS, Express.js, MongoDB with Mongoose ODM, JWT, bcryptjs, Helmet, CORS, Express-Rate-Limit, Nodemailer.
- **Database**: MongoDB with automatic embedded `mongodb-memory-server` fallback (enables immediate zero-friction startup even without a local mongod daemon running).
- **Payment Gateway**: Modular abstraction supporting Razorpay (HMAC SHA-256 signature verification), Stripe, and an automated Sandbox Mock Adapter.

---

## 2. Pre-Seeded Demo Accounts

The database comes with pre-configured demonstration accounts for evaluating each of the 4 roles:

| Role | Email | Password | Assigned Hotel / Scope |
| :--- | :--- | :--- | :--- |
| **Guest** | `guest@hotelpro.com` | `Password@123` | Personal stays, service requests, verified reviews |
| **Hotel Staff** | `staff@hotelpro.com` | `Password@123` | Front Desk, Check-Ins, Housekeeping Queue |
| **Hotel Manager** | `manager@hotelpro.com` | `Password@123` | The Grand Royal Palace & Spa, Mumbai (Rates & Inventory) |
| **Platform Admin** | `admin@hotelpro.com` | `Password@123` | Universal Global Platform Administration |

> **Note**: The login screen also includes convenient **1-Click Demo Buttons** to autofill any of these roles instantly.

---

## 3. Getting Started & Installation

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Step 1: Clone or Navigate to Project
```bash
cd hotelpro
```

### Step 2: Install Dependencies
Install all workspace dependencies across root, server, and client:
```bash
npm run install:all
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Key environment configurations:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotelpro
JWT_SECRET=hotelpro_super_secret_jwt_key_development_32chars_min
PAYMENT_GATEWAY_PROVIDER=mock
CLIENT_URL=http://localhost:5173
```
*(If no local MongoDB service is running, HotelPro automatically starts an embedded MongoDB in-memory engine).*

### Step 4: Seed the Database
Populate the database with luxury hotels (Mumbai, Goa, Udaipur), room categories, physical rooms, active bookings, housekeeping tasks, and verified reviews:
```bash
npm run seed
```

### Step 5: Start Development Application
Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 4. Testing

### Run Backend Automated Tests
Execute the end-to-end integration and unit test suite (covering authentication, RBAC, pricing calculations, reservation holds, payment confirmation, and operations):
```bash
npm test
```
All tests use isolated in-memory MongoDB instances and mock adapters.

### Build Frontend Production Assets
```bash
npm run build
```

---

## 5. Architectural Highlights

### Concurrency Protection & Overlap Prevention
Reservations operate on half-open date intervals `[checkInDate, checkOutDate)`.
Two bookings overlap if:
$$\text{Existing.checkIn} < \text{Requested.checkOut} \quad\text{and}\quad \text{Existing.checkOut} > \text{Requested.checkIn}$$
Active bookings include confirmed, checked-in, and active 15-minute temporary holds (`pending_payment`). Expired holds are automatically purged by asynchronous workers.

### Authoritative Server Pricing
The server calculates all totals authoritatively:
- Base room subtotal = Nightly price × number of nights
- Extra guest surcharge (adults > 2, children > 1)
- Promotional discounts (e.g. `HOTELPRO10` for 10% off)
- Hospitality Goods & Services Tax (18% GST)
- Immutable pricing snapshot saved with the booking.

### Housekeeping Workflow
Check-out transitions room status to `dirty` and dispatches a high-priority `HousekeepingTask`. When staff inspects and completes the task, the room is automatically updated to `clean`.

---

## 6. Project Structure

```
hotelpro/
├── client/                     # Vite + React 18 Frontend
│   ├── src/
│   │   ├── api/                # Axios API client with interceptors
│   │   ├── components/         # Navbar, Footer, BookingModal, PaymentCheckoutModal, etc.
│   │   ├── context/            # AuthContext (JWT session state & actions)
│   │   ├── layouts/            # MainLayout & DashboardLayout
│   │   ├── pages/              # Home, Hotels, Detail, Dashboards, Invoices, Login, Register
│   │   └── styles/             # Luxury Hospitality Custom Design System
│   ├── index.html
│   └── package.json
├── server/                     # Express.js Backend API
│   ├── src/
│   │   ├── config/             # Database connection, embedded engine, constants
│   │   ├── controllers/        # Auth, Hotels, Rooms, Bookings, Payments, Ops, Admin
│   │   ├── middleware/         # JWT Auth, Role RBAC, Hotel Scope, Error handler, Rate limiting
│   │   ├── models/             # Mongoose schemas (User, Hotel, Room, Booking, Payment, etc.)
│   │   ├── routes/             # Versioned Express routes (/api/v1/*)
│   │   ├── services/           # Booking engine, Pricing service, Payment service, Email service
│   │   └── utils/              # Comprehensive seed script
│   ├── tests/                  # Automated backend integration tests
│   └── package.json
├── docs/                       # Architecture, Database schema & API documentation
├── scripts/                    # Concurrent development runner
├── .env.example
├── README.md
└── package.json
```

---

## 7. License
ISC License. Built for HotelPro Hospitality Platforms.

