# HotelPro Database Schema Specification

## 1. Entity Relationship Overview
The database uses MongoDB with Mongoose schemas designed for ACID compliance, referential integrity, indexing performance, and auditability.

```
       ┌────────────────────────┐
       │         User           │
       │ (Guest,Staff,Mgr,Admin)│
       └───────────┬────────────┘
                   │
    ┌──────────────┼────────────────────────┐
    │ (manages)    │ (books)                │ (writes)
    ▼              ▼                        ▼
┌───────┐     ┌─────────┐               ┌────────┐
│ Hotel │◄────┤ Booking │──────────────►│ Review │
└───┬───┘     └────┬────┘               └────────┘
    │              │
    │ (has)        │ (has)
    ▼              ▼
┌──────────────┐ ┌─────────┐
│ RoomCategory │ │ Payment │
└───────┬──────┘ └─────────┘
        │
        │ (contains)
        ▼
┌──────────────┐
│     Room     │
└───────┬──────┘
        │
    ┌───┴────────────────┐
    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ HousekeepingTask │  │  ServiceRequest  │
└──────────────────┘  └──────────────────┘
```

## 2. Core Collections & Schema Details

### 2.1 User (`users`)
- `_id`: ObjectId
- `name`: String (required, trimmed, max 100)
- `email`: String (required, unique, lowercase, indexed)
- `password`: String (hashed with bcrypt 10 rounds, selected: false by default)
- `phone`: String (optional)
- `role`: Enum `['guest', 'staff', 'manager', 'admin']` (default: `'guest'`, indexed)
- `hotelId`: ObjectId -> `Hotel` (optional, for staff and manager assigned hotel)
- `avatar`: String (URL)
- `isEmailVerified`: Boolean (default: true for seeded/dev, token validated)
- `status`: Enum `['active', 'suspended']` (default: `'active'`)
- `createdAt`, `updatedAt`: Timestamps

### 2.2 Hotel (`hotels`)
- `_id`: ObjectId
- `name`: String (required, trimmed)
- `slug`: String (unique, slugified name, indexed)
- `description`: String (required)
- `address`: String (required)
- `city`: String (required, indexed)
- `state`: String (required)
- `country`: String (required, default: 'India')
- `postalCode`: String
- `starRating`: Number (1 to 5, default 4)
- `averageRating`: Number (0 to 5, default 0, indexed)
- `reviewCount`: Number (default 0)
- `contactEmail`: String
- `contactPhone`: String
- `amenities`: [String] (e.g., 'Free WiFi', 'Infinity Pool', 'Spa & Wellness', 'Fine Dining', 'Airport Shuttle', 'Valet Parking', 'Fitness Center')
- `images`: [String] (curated luxury hotel image URLs)
- `status`: Enum `['pending', 'active', 'suspended']` (default: `'active'`, indexed)
- `managerId`: ObjectId -> `User`
- `checkInTime`: String (default: '14:00')
- `checkOutTime`: String (default: '11:00')
- `cancellationPolicy`: String
- `createdAt`, `updatedAt`: Timestamps

### 2.3 RoomCategory (`room_categories`)
- `_id`: ObjectId
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `name`: String (e.g. 'Deluxe King Suite', 'Executive Ocean Suite', 'Presidential Villa')
- `slug`: String
- `description`: String
- `basePrice`: Number (required, nightly price in INR/USD, indexed)
- `capacity`: { adults: Number, children: Number, maxGuests: Number }
- `bedType`: String ('King', 'Queen', 'Twin Double')
- `roomSizeSqFt`: Number
- `amenities`: [String]
- `images`: [String]
- `totalRooms`: Number
- `createdAt`, `updatedAt`: Timestamps

### 2.4 Room (`rooms`)
- `_id`: ObjectId
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `categoryId`: ObjectId -> `RoomCategory` (required, indexed)
- `roomNumber`: String (required, e.g., '101', '204', 'PH-1', compound unique index with hotelId)
- `floor`: Number
- `operationalStatus`: Enum `['clean', 'dirty', 'cleaning', 'maintenance', 'out_of_service']` (default: 'clean', indexed)
- `isActive`: Boolean (default: true)
- `notes`: String
- `createdAt`, `updatedAt`: Timestamps

### 2.5 Booking (`bookings`)
- `_id`: ObjectId
- `bookingReference`: String (unique uppercase alphanumeric e.g. 'HP-2026-89412', indexed)
- `guestId`: ObjectId -> `User` (required, indexed)
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `categoryId`: ObjectId -> `RoomCategory` (required)
- `roomId`: ObjectId -> `Room` (optional until assigned upon check-in or booking)
- `checkInDate`: Date (required, indexed)
- `checkOutDate`: Date (required, indexed)
- `nights`: Number (computed)
- `guests`: { adults: Number, children: Number }
- `status`: Enum `['pending_payment', 'confirmed', 'checked_in', 'checked_out', 'cancellation_requested', 'cancelled', 'expired']` (indexed)
- `pricingBreakdown`:
  - `baseNightlyRate`: Number
  - `nights`: Number
  - `roomSubtotal`: Number
  - `extraGuestFee`: Number
  - `taxesAndFees`: Number (18% GST / Hospitality tax)
  - `discount`: Number
  - `totalAmount`: Number (final authoritative amount)
  - `currency`: String (default 'INR')
- `paymentStatus`: Enum `['pending', 'completed', 'failed', 'refunded']` (indexed)
- `guestSnapshot`: { name: String, email: String, phone: String }
- `specialRequests`: String
- `holdExpiresAt`: Date (temporary reservation hold window)
- `checkedInAt`: Date
- `checkedOutAt`: Date
- `cancelledAt`: Date
- `cancellationReason`: String
- `createdAt`, `updatedAt`: Timestamps

### 2.6 Payment (`payments`)
- `_id`: ObjectId
- `bookingId`: ObjectId -> `Booking` (required, indexed)
- `guestId`: ObjectId -> `User` (required, indexed)
- `hotelId`: ObjectId -> `Hotel` (required)
- `amount`: Number (required)
- `currency`: String (default 'INR')
- `provider`: Enum `['mock', 'stripe', 'razorpay']` (default 'mock')
- `orderId`: String
- `paymentId`: String
- `signature`: String
- `status`: Enum `['pending', 'successful', 'failed', 'refunded']` (indexed)
- `idempotencyKey`: String (unique, indexed)
- `refundAmount`: Number
- `refundReason`: String
- `createdAt`, `updatedAt`: Timestamps

### 2.7 HousekeepingTask (`housekeeping_tasks`)
- `_id`: ObjectId
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `roomId`: ObjectId -> `Room` (required, indexed)
- `assignedTo`: ObjectId -> `User` (Staff member)
- `priority`: Enum `['low', 'medium', 'high', 'urgent']` (default 'medium')
- `status`: Enum `['pending', 'in_progress', 'completed']` (default 'pending', indexed)
- `notes`: String
- `scheduledFor`: Date
- `completedAt`: Date
- `createdAt`, `updatedAt`: Timestamps

### 2.8 ServiceRequest (`service_requests`)
- `_id`: ObjectId
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `bookingId`: ObjectId -> `Booking` (required, indexed)
- `guestId`: ObjectId -> `User` (required, indexed)
- `roomId`: ObjectId -> `Room`
- `requestType`: Enum `['towels', 'cleaning', 'room_service', 'maintenance', 'wakeup_call', 'other']`
- `description`: String (required)
- `priority`: Enum `['low', 'medium', 'high']`
- `status`: Enum `['submitted', 'acknowledged', 'in_progress', 'completed', 'cancelled']` (default 'submitted')
- `assignedTo`: ObjectId -> `User`
- `resolutionNotes`: String
- `createdAt`, `updatedAt`: Timestamps

### 2.9 Review (`reviews`)
- `_id`: ObjectId
- `hotelId`: ObjectId -> `Hotel` (required, indexed)
- `guestId`: ObjectId -> `User` (required, indexed)
- `bookingId`: ObjectId -> `Booking` (required, unique compound index with guestId to guarantee 1 review per stay)
- `rating`: Number (1 to 5, required)
- `title`: String
- `comment`: String (required)
- `status`: Enum `['approved', 'pending', 'rejected']` (default 'approved')
- `createdAt`, `updatedAt`: Timestamps

### 2.10 AuditLog (`audit_logs`)
- `_id`: ObjectId
- `action`: String (e.g. 'USER_STATUS_UPDATE', 'HOTEL_APPROVED', 'REFUND_PROCESSED', 'ROOM_MODIFIED')
- `userId`: ObjectId -> `User`
- `userRole`: String
- `targetResource`: String
- `targetId`: String
- `details`: Object / Mixed
- `ipAddress`: String
- `createdAt`: Date (indexed)
