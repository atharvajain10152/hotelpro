import { PaymentService } from '../services/paymentService.js';
import Payment from '../models/Payment.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const orderData = await PaymentService.createOrder({
      bookingId,
      guestId: req.user._id
    });

    res.status(200).json({
      success: true,
      order: orderData
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, orderId, paymentId, signature } = req.body;

    const result = await PaymentService.verifyPayment({
      bookingId,
      orderId,
      paymentId,
      signature,
      guestId: req.user._id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ guestId: req.user._id })
      .populate('bookingId', 'bookingReference checkInDate checkOutDate status')
      .populate('hotelId', 'name city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (err) {
    next(err);
  }
};
