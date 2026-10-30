# HotelPro REST API Specification (v1)

Base URL: `http://localhost:5000/api/v1`

All responses follow standard JSON structures:
- Success: `{ "success": true, ...data }`
- Error: `{ "success": false, "message": "...", "errors"?: [] }`

---

## 1. Authentication (`/auth`)

### POST `/auth/register`
- **Access**: Public
- **Body**: `{ "name", "email", "password", "phone"?, "role"? }`
- **Response**: `201 Created` with user object and session token cookie.

### POST `/auth/login`
- **Access**: Public (Rate-limited: 30 attempts / 15 mins)
- **Body**: `{ "email", "password" }`
- **Response**: `200 OK` with user profile and token.

### POST `/auth/logout`
- **Access**: Public
- **Response**: `200 OK` (clears auth cookie).

### GET `/auth/me`
- **Access**: Protected (`protect`)
- **Response**: `200 OK` with populated current user profile.

### PUT `/auth/profile`
- **Access**: Protected (`protect`)
- **Body**: `{ "name"?, "phone"?, "avatar"? }`
- **Response**: `200 OK`

---

## 2. Hotels & Discovery (`/hotels`)

### GET `/hotels`
- **Access**: Public
- **Query Params**: `destination`, `city`, `minRating`, `amenities`, `sort`, `page`, `limit`
- **Response**: `200 OK` with paginated hotel list and starting room rates.

### GET `/hotels/:id`
- **Access**: Public
- **Params**: `id` (ObjectId or Slug)
- **Response**: `200 OK` with hotel profile, room categories, and verified reviews.

### POST `/hotels`
- **Access**: Admin, Manager
- **Body**: Hotel creation details.
- **Response**: `201 Created`

### PUT `/hotels/:id`
- **Access**: Admin, Manager (hotel scoped)
- **Response**: `200 OK`

---

## 3. Room Inventory & Availability (`/rooms`)

### GET `/rooms/hotel/:hotelId/categories`
- **Access**: Public
- **Response**: `200 OK` with array of suite categories.

### GET `/rooms/hotel/:hotelId/category/:categoryId/availability`
- **Access**: Public
- **Query Params**: `checkInDate`, `checkOutDate`, `adults`, `children`, `couponCode`?
- **Response**: `200 OK` with `{ isAvailable, availableRooms, pricing }`.

### PUT `/rooms/category/:categoryId`
- **Access**: Admin, Manager
- **Body**: `{ "basePrice"?, "totalRooms"?, "amenities"? }`
- **Response**: `200 OK` with updated category.

---

## 4. Reservation Engine (`/bookings`)

### POST `/bookings/hold`
- **Access**: Protected (Guest, Admin)
- **Body**: `{ "hotelId", "categoryId", "checkInDate", "checkOutDate", "guests", "specialRequests"?, "couponCode"? }`
- **Response**: `201 Created` with temporary 15-minute hold and unique booking reference (`HP-XXXXX`).

### GET `/bookings/my`
- **Access**: Protected (Guest)
- **Query Params**: `status`?
- **Response**: `200 OK` with guest booking history.

### GET `/bookings/:id`
- **Access**: Protected (Owner Guest, Staff/Manager of Hotel, Admin)
- **Response**: `200 OK` with complete booking snapshot, itemized pricing, and invoice metadata.

### POST `/bookings/:id/cancel`
- **Access**: Protected (Owner Guest, Hotel Manager, Admin)
- **Body**: `{ "reason"? }`
- **Response**: `200 OK` with cancellation and refund status.

---

## 5. Payments (`/payments`)

### POST `/payments/create-order`
- **Access**: Protected (Guest)
- **Body**: `{ "bookingId" }`
- **Response**: `200 OK` with `{ orderId, amount, currency, provider }`.

### POST `/payments/verify`
- **Access**: Protected (Guest)
- **Body**: `{ "bookingId", "orderId", "paymentId", "signature" }`
- **Response**: `200 OK` with confirmed booking and transactional email dispatch.

---

## 6. Operations & Front Desk (`/operations`)

### GET `/operations/overview`
- **Access**: Staff, Manager, Admin
- **Query Params**: `hotelId`?
- **Response**: `200 OK` with arrivals today, departures today, in-house guests, and room cleanliness stats.

### POST `/operations/check-in`
- **Access**: Staff, Manager, Admin
- **Body**: `{ "bookingId", "roomId"? }`
- **Response**: `200 OK` (sets booking to `checked_in`).

### POST `/operations/check-out`
- **Access**: Staff, Manager, Admin
- **Body**: `{ "bookingId" }`
- **Response**: `200 OK` (sets booking to `checked_out`, marks room `dirty`, creates housekeeping task).

### GET `/operations/housekeeping`
- **Access**: Staff, Manager, Admin
- **Response**: `200 OK` with list of cleaning and maintenance tasks.

### PATCH `/operations/housekeeping/:id`
- **Access**: Staff, Manager, Admin
- **Body**: `{ "status": "in_progress" | "completed", "notes"? }`
- **Response**: `200 OK` (completing automatically marks room `clean`).

### GET `/operations/services`
- **Access**: Guest (own requests) or Staff/Manager (hotel requests)
- **Response**: `200 OK`

### POST `/operations/services`
- **Access**: Guest
- **Body**: `{ "bookingId", "requestType", "description", "priority"? }`
- **Response**: `201 Created`

### PATCH `/operations/services/:id`
- **Access**: Staff, Manager, Admin
- **Body**: `{ "status": "acknowledged" | "in_progress" | "completed" }`
- **Response**: `200 OK`

---

## 7. Platform Administration (`/admin`)

### GET `/admin/dashboard`
- **Access**: Admin only
- **Response**: `200 OK` with global KPIs, bookings breakdown, and monthly revenue aggregation.

### GET `/admin/users`
- **Access**: Admin only
- **Query Params**: `role`, `status`, `search`, `page`, `limit`
- **Response**: `200 OK` with paginated user directory.

### PATCH `/admin/users/:id/status`
- **Access**: Admin only
- **Body**: `{ "status": "active" | "suspended" }`
- **Response**: `200 OK`

### PATCH `/admin/hotels/:id/approval`
- **Access**: Admin only
- **Body**: `{ "status": "active" | "suspended" }`
- **Response**: `200 OK`

### GET `/admin/audit-logs`
- **Access**: Admin only
- **Response**: `200 OK` with recent audit logs.

