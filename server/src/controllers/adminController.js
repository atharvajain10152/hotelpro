import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import { BOOKING_STATUS, PAYMENT_STATUS, HOTEL_STATUS } from '../config/constants.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const activeHotels = await Hotel.countDocuments({ status: HOTEL_STATUS.ACTIVE });
    const pendingHotels = await Hotel.countDocuments({ status: HOTEL_STATUS.PENDING });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: BOOKING_STATUS.CONFIRMED });
    const checkedInBookings = await Booking.countDocuments({ status: BOOKING_STATUS.CHECKED_IN });
    const checkedOutBookings = await Booking.countDocuments({ status: BOOKING_STATUS.CHECKED_OUT });
    const cancelledBookings = await Booking.countDocuments({ status: BOOKING_STATUS.CANCELLED });

    // Revenue aggregation (successful payments excluding refunds)
    const revenueStats = await Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.SUCCESSFUL } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUS.SUCCESSFUL,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers },
        hotels: { total: totalHotels, active: activeHotels, pending: pendingHotels },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          checkedIn: checkedInBookings,
          checkedOut: checkedOutBookings,
          cancelled: cancelledBookings
        },
        financials: {
          totalRevenue,
          monthlyRevenue
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('hotelId', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();

    await AuditLog.create({
      action: 'USER_UPDATED_BY_ADMIN',
      userId: req.user._id,
      userRole: req.user.role,
      targetResource: 'User',
      targetId: user._id.toString(),
      details: { status, role }
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateHotelApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const hotel = await Hotel.findByIdAndUpdate(id, { status }, { new: true });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    await AuditLog.create({
      action: 'HOTEL_APPROVAL_CHANGED',
      userId: req.user._id,
      userRole: req.user.role,
      targetResource: 'Hotel',
      targetId: hotel._id.toString(),
      details: { newStatus: status }
    });

    res.status(200).json({ success: true, hotel });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      logs
    });
  } catch (err) {
    next(err);
  }
};

