import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB } from '../src/config/db.js';
import { seedDatabase } from '../src/utils/seed.js';
import { PricingService } from '../src/services/pricingService.js';
import { BookingService } from '../src/services/bookingService.js';

let guestToken = '';
let staffToken = '';
let managerToken = '';
let adminToken = '';
let hotelId = '';
let categoryId = '';

before(async () => {
  process.env.USE_MEMORY_DB = 'true';
  process.env.NODE_ENV = 'test';
  await connectDB();
  await seedDatabase();
});

after(async () => {
  await closeDB();
});

test('1. System Health Check', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'healthy');
});

test('2. Authentication - Login Demo Accounts', async () => {
  // Guest login
  const resGuest = await request(app).post('/api/v1/auth/login').send({
    email: 'guest@hotelpro.com',
    password: 'Password@123'
  });
  assert.equal(resGuest.status, 200);
  assert.equal(resGuest.body.success, true);
  assert.equal(resGuest.body.user.role, 'guest');
  guestToken = resGuest.body.token;

  // Staff login
  const resStaff = await request(app).post('/api/v1/auth/login').send({
    email: 'staff@hotelpro.com',
    password: 'Password@123'
  });
  assert.equal(resStaff.status, 200);
  assert.equal(resStaff.body.user.role, 'staff');
  staffToken = resStaff.body.token;

  // Manager login
  const resMgr = await request(app).post('/api/v1/auth/login').send({
    email: 'manager@hotelpro.com',
    password: 'Password@123'
  });
  assert.equal(resMgr.status, 200);
  assert.equal(resMgr.body.user.role, 'manager');
  managerToken = resMgr.body.token;

  // Admin login
  const resAdmin = await request(app).post('/api/v1/auth/login').send({
    email: 'admin@hotelpro.com',
    password: 'Password@123'
  });
  assert.equal(resAdmin.status, 200);
  assert.equal(resAdmin.body.user.role, 'admin');
  adminToken = resAdmin.body.token;
});

test('3. Authentication - Reject Invalid Password', async () => {
  const res = await request(app).post('/api/v1/auth/login').send({
    email: 'guest@hotelpro.com',
    password: 'WrongPassword'
  });
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('4. Hotel Discovery & Search', async () => {
  const res = await request(app).get('/api/v1/hotels?destination=Mumbai');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.hotels.length >= 1);
  hotelId = res.body.hotels[0]._id;

  // Get hotel details with categories
  const resDetails = await request(app).get(`/api/v1/hotels/${hotelId}`);
  assert.equal(resDetails.status, 200);
  assert.equal(resDetails.body.hotel.name, 'The Grand Royal Palace & Spa');
  assert.ok(resDetails.body.categories.length >= 1);
  categoryId = resDetails.body.categories[0]._id;
});

test('5. Pricing Service - Authoritative Calculations', async () => {
  const checkIn = new Date('2026-12-01');
  const checkOut = new Date('2026-12-04'); // 3 nights
  const pricing = PricingService.calculatePricing({
    basePrice: 10000,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: 3, // 1 extra adult = ₹1,000 * 3 = ₹3,000
    children: 0,
    couponCode: 'HOTELPRO10' // 10% off room subtotal (30,000 * 0.1 = 3,000)
  });

  assert.equal(pricing.nights, 3);
  assert.equal(pricing.roomSubtotal, 30000);
  assert.equal(pricing.extraGuestFee, 3000);
  assert.equal(pricing.discount, 3000);
  // Taxable = 30000 + 3000 - 3000 = 30000
  // Tax 18% = 5400
  assert.equal(pricing.taxesAndFees, 5400);
  assert.equal(pricing.totalAmount, 35400);
});

test('6. Reservation Engine - Create Hold & Prevent Invalid Interval', async () => {
  // Invalid date range (checkout before checkin)
  await assert.rejects(
    async () => {
      PricingService.calculatePricing({
        basePrice: 5000,
        checkInDate: '2026-12-05',
        checkOutDate: '2026-12-02'
      });
    },
    { message: /Check-out date must be at least 1 night after check-in date/ }
  );

  // Valid hold reservation via API
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 20);
  const checkOut = new Date();
  checkOut.setDate(checkOut.getDate() + 22);

  const resHold = await request(app)
    .post('/api/v1/bookings/hold')
    .set('Authorization', `Bearer ${guestToken}`)
    .send({
      hotelId,
      categoryId,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      guests: { adults: 2, children: 0 }
    });

  assert.equal(resHold.status, 201);
  assert.equal(resHold.body.success, true);
  assert.equal(resHold.body.booking.status, 'pending_payment');
  assert.ok(resHold.body.booking.bookingReference.startsWith('HP-'));

  const createdBookingId = resHold.body.booking._id;

  // 7. Payment Simulation & Booking Confirmation
  const resOrder = await request(app)
    .post('/api/v1/payments/create-order')
    .set('Authorization', `Bearer ${guestToken}`)
    .send({ bookingId: createdBookingId });

  assert.equal(resOrder.status, 200);
  assert.ok(resOrder.body.order.orderId);

  const resVerify = await request(app)
    .post('/api/v1/payments/verify')
    .set('Authorization', `Bearer ${guestToken}`)
    .send({
      bookingId: createdBookingId,
      orderId: resOrder.body.order.orderId,
      paymentId: 'pay_mock_test_12345',
      signature: 'signature_valid'
    });

  assert.equal(resVerify.status, 200);
  assert.equal(resVerify.body.booking.status, 'confirmed');
  assert.equal(resVerify.body.booking.paymentStatus, 'successful');
});

test('8. Role-Based Access Control', async () => {
  // Guest cannot access admin dashboard
  const resDenied = await request(app)
    .get('/api/v1/admin/dashboard')
    .set('Authorization', `Bearer ${guestToken}`);
  assert.equal(resDenied.status, 403);

  // Admin CAN access admin dashboard
  const resAllowed = await request(app)
    .get('/api/v1/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(resAllowed.status, 200);
  assert.ok(resAllowed.body.data.hotels.total >= 3);
});

test('9. Operations - Daily Overview & Housekeeping', async () => {
  const resOverview = await request(app)
    .get(`/api/v1/operations/overview?hotelId=${hotelId}`)
    .set('Authorization', `Bearer ${staffToken}`);

  assert.equal(resOverview.status, 200);
  assert.ok(resOverview.body.data.roomStats.total >= 3);

  const resTasks = await request(app)
    .get(`/api/v1/operations/housekeeping?hotelId=${hotelId}`)
    .set('Authorization', `Bearer ${staffToken}`);

  assert.equal(resTasks.status, 200);
  assert.ok(resTasks.body.tasks.length >= 1);
});

test('10. Hotel Details Management - Create & Update Rich Details', async () => {
  // Admin creates new hotel with full details
  const resCreate = await request(app)
    .post('/api/v1/hotels')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'The Oberoi Heritage Villa & Spa',
      tagline: 'Timeless Luxury Overlooking the Aravallis',
      description: 'An architectural jewel featuring marble courtyards and world-class spas.',
      address: '22 Lake Palace Road',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      postalCode: '313002',
      starRating: 5,
      contactEmail: 'concierge@oberoiheritage.com',
      contactPhone: '+91 294 255 1122',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in.',
      amenities: ['Private Plunge Pool', 'Ayurvedic Spa', '24/7 Butler Service'],
      highlights: ['Lakefront Boat Arrival', 'Royal Mewari Dinners'],
      propertyDetails: {
        yearBuilt: 2021,
        architecturalStyle: 'Traditional Rajasthani',
        totalRooms: 45,
        airportDistance: '22 km from Maharana Pratap Airport'
      }
    });

  assert.equal(resCreate.status, 201);
  assert.equal(resCreate.body.success, true);
  assert.equal(resCreate.body.hotel.name, 'The Oberoi Heritage Villa & Spa');
  assert.equal(resCreate.body.hotel.tagline, 'Timeless Luxury Overlooking the Aravallis');
  assert.equal(resCreate.body.hotel.propertyDetails.totalRooms, 45);

  const createdId = resCreate.body.hotel._id;

  // Manager updates existing hotel details
  const resUpdate = await request(app)
    .put(`/api/v1/hotels/${hotelId}`)
    .set('Authorization', `Bearer ${managerToken}`)
    .send({
      tagline: 'Updated Signature Waterfront Luxury Experience',
      contactPhone: '+91 22 9999 8888'
    });

  assert.equal(resUpdate.status, 200);
  assert.equal(resUpdate.body.success, true);
  assert.equal(resUpdate.body.hotel.tagline, 'Updated Signature Waterfront Luxury Experience');
  assert.equal(resUpdate.body.hotel.contactPhone, '+91 22 9999 8888');

  // Verify via public GET
  const resGet = await request(app).get(`/api/v1/hotels/${createdId}`);
  assert.equal(resGet.status, 200);
  assert.equal(resGet.body.hotel.city, 'Udaipur');
  assert.ok(resGet.body.hotel.highlights.includes('Lakefront Boat Arrival'));
});


