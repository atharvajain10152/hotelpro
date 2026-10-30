// HotelPro System Constants & Enums

export const ROLES = {
  GUEST: 'guest',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
};

export const HOTEL_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
};

export const ROOM_STATUS = {
  CLEAN: 'clean',
  DIRTY: 'dirty',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
};

export const BOOKING_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLATION_REQUESTED: 'cancellation_requested',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const HOUSEKEEPING_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const HOUSEKEEPING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const SERVICE_REQUEST_STATUS = {
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const SERVICE_REQUEST_TYPES = [
  'towels',
  'cleaning',
  'room_service',
  'maintenance',
  'wakeup_call',
  'other'
];

export const TAX_RATE_PERCENT = 18; // 18% standard GST / Hospitality Tax
export const HOLD_EXPIRATION_MINUTES = 15; // 15-minute temporary hold

