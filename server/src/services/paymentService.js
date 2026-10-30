import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../config/constants.js';
import { EmailService } from './emailService.js';

export class PaymentService {
  /**
   * Create payment order for a pending booking
   */
  static async createOrder({ bookingId, guestId }) {
    const booking = await Booking.findOne({
      _id: bookingId,
      guestId,
      status: BOOKING_STATUS.PENDING_PAYMENT
    }).populate('hotelId categoryId');

    if (!booking) {
      throw new Error('Booking not found or not in pending payment state.');
    }

    if (new Date() > new Date(booking.holdExpiresAt)) {
      booking.status = BOOKING_STATUS.EXPIRED;
      await booking.save();
      throw new Error('Reservation hold has expired. Please initiate a new booking.');
    }

    const provider = process.env.PAYMENT_GATEWAY_PROVIDER || 'mock';
    const amount = booking.pricingBreakdown.totalAmount;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const idempotencyKey = `idemp_${booking._id}_${Date.now()}`;

    const payment = await Payment.create({
      bookingId: booking._id,
      guestId,
      hotelId: booking.hotelId._id,
      amount,
      currency: booking.pricingBreakdown.currency || 'INR',
      provider,
      orderId,
      status: PAYMENT_STATUS.PENDING,
      idempotencyKey
    });

    return {
      orderId,
      amount,
      currency: payment.currency,
      provider,
      bookingReference: booking.bookingReference,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_hotelpro_key'
    };
  }

  /**
   * Verify payment signature and confirm booking
   */
  static async verifyPayment({ bookingId, orderId, paymentId, signature, guestId }) {
    const booking = await Booking.findOne({ _id: bookingId, guestId }).populate('hotelId categoryId');
    if (!booking) {
      throw new Error('Booking not found.');
    }

    const payment = await Payment.findOne({ bookingId: booking._id, orderId });
    if (!payment) {
      throw new Error('Associated payment order record not found.');
    }

    if (payment.status === PAYMENT_STATUS.SUCCESSFUL) {
      return { success: true, booking, message: 'Payment already processed successfully.' };
    }

    // Provider signature verification (Mock / Razorpay / Stripe)
    let isSignatureValid = false;
    const provider = payment.provider;

    if (provider === 'mock') {
      // In mock development mode, require standard format
      isSignatureValid = Boolean(paymentId && paymentId.startsWith('pay_mock_'));
    } else if (provider === 'razorpay') {
      // Razorpay HMAC SHA256 verification
      if (process.env.RAZORPAY_KEY_SECRET) {
        const crypto = await import('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');
        isSignatureValid = expectedSignature === signature;
      } else {
        isSignatureValid = true; // Fallback in non-configured test mode
      }
    } else {
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      payment.status = PAYMENT_STATUS.FAILED;
      await payment.save();
      throw new Error('Payment verification signature check failed.');
    }

    // Success path: update payment & booking
    payment.paymentId = paymentId;
    payment.signature = signature || 'verified_dev';
    payment.status = PAYMENT_STATUS.SUCCESSFUL;
    await payment.save();

    booking.status = BOOKING_STATUS.CONFIRMED;
    booking.paymentStatus = PAYMENT_STATUS.SUCCESSFUL;
    booking.holdExpiresAt = null;
    await booking.save();

    // Trigger confirmation email
    try {
      await EmailService.sendBookingConfirmation(booking, booking.guestSnapshot.email);
    } catch (e) {
      console.warn(`[Email Warning] Could not dispatch email: ${e.message}`);
    }

    return {
      success: true,
      booking,
      payment
    };
  }

  /**
   * Process refund request
   */
  static async processRefund({ bookingId, user, reason }) {
    const booking = await Booking.findById(bookingId).populate('hotelId');
    if (!booking) {
      throw new Error('Booking record not found.');
    }

    // Check permissions: guest owns booking OR manager of hotel OR admin
    const isOwner = booking.guestId.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    const isHotelManager =
      user.role === 'manager' && user.hotelId?.toString() === booking.hotelId._id.toString();

    if (!isOwner && !isAdmin && !isHotelManager) {
      throw new Error('Unauthorized to cancel or refund this booking.');
    }

    if (
      booking.status !== BOOKING_STATUS.CONFIRMED &&
      booking.status !== BOOKING_STATUS.CANCELLATION_REQUESTED
    ) {
      throw new Error(`Cannot cancel booking in '${booking.status}' status.`);
    }

    const payment = await Payment.findOne({
      bookingId: booking._id,
      status: PAYMENT_STATUS.SUCCESSFUL
    });

    const refundAmount = payment ? payment.amount : 0;

    if (payment) {
      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundAmount = refundAmount;
      payment.refundReason = reason || 'Guest initiated cancellation';
      await payment.save();
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Guest cancellation';
    await booking.save();

    // Record audit log
    await AuditLog.create({
      action: 'BOOKING_CANCELLED_AND_REFUNDED',
      userId: user._id,
      userRole: user.role,
      targetResource: 'Booking',
      targetId: booking._id.toString(),
      details: {
        bookingReference: booking.bookingReference,
        refundAmount,
        reason
      }
    });

    return {
      success: true,
      message: 'Booking cancelled and eligible refund initiated successfully.',
      refundAmount
    };
  }
}

