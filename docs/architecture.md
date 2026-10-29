# HotelPro System Architecture Documentation

## 1. Executive Architecture Summary
HotelPro is an enterprise-grade full-stack hospitality reservation and hotel operations web application built on the MERN stack (MongoDB, Express.js, React 18 with Vite, and Node.js 20+ LTS).

The platform coordinates four primary personas:
- **Guest**: Discovery, availability checks, authoritative pricing calculation, reservation holds, cryptographic payment verification, cancellation/refund handling, guest service requests, and verified stay reviews.
- **Hotel Staff**: Front-desk check-in, room key assignment, guest check-out, housekeeping task management, and guest request fulfillment.
- **Hotel Manager**: Assigned hotel control, suite category management, dynamic base pricing, capacity governance, and occupancy analytics.
- **Platform Administrator**: Global user management, hotel onboarding approvals, system financial aggregates, security, and audit logs.

```
                           ┌────────────────────────┐
                           │      HotelPro Web      │
                           │     (React + Vite)     │
                           └───────────┬────────────┘
                                       │ HTTPS / JSON API
                                       ▼
                           ┌────────────────────────┐
                           │   Express.js Gateway   │
                           │ (Security, CORS, Rate) │
                           └───────────┬────────────┘
                                       │
     ┌──────────────────┬──────────────┼──────────────────┬─────────────────┐
     ▼                  ▼              ▼                  ▼                 ▼
┌──────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ ┌──────────────┐
│ Auth & Roles │ │ Discovery & │ │ Booking &   │ │ Payment Gateway │ │ Operations & │
│ (JWT/Bcrypt) │ │ Category    │ │ Hold Engine │ │ (Mock/Stripe/RP)│ │ Housekeeping │
└──────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘ └──────────────┘
                                       │
                                       ▼
                           ┌────────────────────────┐
                           │  MongoDB Storage &     │
                           │   Mongoose Schemas     │
                           └────────────────────────┘
```

---

## 2. Multi-Role Authorization & Scope Isolation
HotelPro implements strict server-side Role-Based Access Control (RBAC):
1. `protect`: Verifies JWT from HTTP-only cookies or Authorization Bearer header.
2. `authorize(...roles)`: Verifies role permissions (`guest`, `staff`, `manager`, `admin`).
3. `requireHotelScope`: Strictly restricts Staff and Managers to only access or modify records belonging to their assigned `hotelId`. Platform Administrators bypass hotel scope for universal governance.

---

## 3. High-Concurrency Reservation Engine & Overlap Prevention
Booking overlap prevention operates on half-open date intervals `[checkInDate, checkOutDate)`.
- If an existing reservation occupies `[cIn, cOut)`, a new reservation `[reqIn, reqOut)` conflicts if and only if:
  `cIn < reqOut AND cOut > reqIn`.
- Active reservations include:
  1. Status in `['confirmed', 'checked_in']`
  2. Status = `'pending_payment'` with `holdExpiresAt > new Date()`
- Temporary reservation holds expire automatically after 15 minutes unless confirmed via verified payment.
- Automatic hold expiration sweeps run asynchronously before checking inventory.

---

## 4. Authoritative Pricing Engine
Pricing calculations are performed exclusively on the backend:
- Room base price × number of nights.
- Extra guest charge (for adults > 2, children > 1).
- Promotional discounts (e.g. `HOTELPRO10`, `LUXURY20`).
- Hospitality GST (18% standard).
- Snapshots of itemized breakdown stored immutably with the booking record to guarantee historical consistency.

---

## 5. Payment Gateway Abstraction & Idempotency
- Modular payment service supporting `mock` (for offline, deterministic testing), `razorpay` (HMAC SHA-256 signature verification), and `stripe`.
- Payment orders are bound to unique booking references and idempotency keys to prevent duplicate transaction settlement.
- No sensitive cardholder data or credentials stored on premises.

---

## 6. Housekeeping & Operational Lifecycle
- Check-out automatically sets room operational status to `dirty` and generates high-priority housekeeping tasks.
- Housekeeping staff mark tasks `in_progress` (room `cleaning`) and `completed` (room `clean`).
- Clean rooms are automatically prioritized for new guest check-ins.
