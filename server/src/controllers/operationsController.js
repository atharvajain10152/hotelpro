import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import HousekeepingTask from '../models/HousekeepingTask.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { BOOKING_STATUS, ROOM_STATUS, HOUSEKEEPING_STATUS } from '../config/constants.js';

export const getDailyOverview = async (req, res, next) => {
  try {
    const hotelId = req.user.hotelId || req.params.hotelId || req.query.hotelId;
    if (!hotelId) {
      return res.status(400).json({ success: false, message: 'Hotel ID is required.' });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Arrivals today
    const arrivals = await Booking.find({
      hotelId,
      checkInDate: { $gte: todayStart, $lte: todayEnd },
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING_PAYMENT] }
    })
      .populate('guestId', 'name email phone')
      .populate('categoryId', 'name')
      .populate('roomId', 'roomNumber');

    // 2. Departures today
    const departures = await Booking.find({
      hotelId,
      checkOutDate: { $gte: todayStart, $lte: todayEnd },
      status: BOOKING_STATUS.CHECKED_IN
    })
      .populate('guestId', 'name email phone')
      .populate('roomId', 'roomNumber');

    // 3. In-house guests
    const inHouse = await Booking.find({
      hotelId,
      status: BOOKING_STATUS.CHECKED_IN
    })
      .populate('guestId', 'name email phone')
      .populate('roomId', 'roomNumber');

    // 4. Room status distribution
    const roomDistribution = await Room.aggregate([
      { $match: { hotelId } },
      { $group: { _id: '$operationalStatus', count: { $sum: 1 } } }
    ]);

    const roomStats = {
      clean: 0,
      dirty: 0,
      cleaning: 0,
      maintenance: 0,
      out_of_service: 0,
      total: 0
    };

    roomDistribution.forEach((item) => {
      roomStats[item._id] = item.count;
      roomStats.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        arrivals,
        departures,
        inHouse,
        roomStats
      }
    });
  } catch (err) {
    next(err);
  }
};

export const processCheckIn = async (req, res, next) => {
  try {
    const { bookingId, roomId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      return res.status(400).json({
        success: false,
        message: `Cannot check in booking with status '${booking.status}'. Booking must be confirmed.`
      });
    }

    let assignedRoomId = roomId || booking.roomId;
    if (!assignedRoomId) {
      // Find a clean room in this category
      const cleanRoom = await Room.findOne({
        hotelId: booking.hotelId,
        categoryId: booking.categoryId,
        operationalStatus: ROOM_STATUS.CLEAN,
        isActive: true
      });

      if (!cleanRoom) {
        return res.status(400).json({
          success: false,
          message: 'No clean room is currently available for check-in. Please inspect or assign manually.'
        });
      }
      assignedRoomId = cleanRoom._id;
    }

    booking.roomId = assignedRoomId;
    booking.status = BOOKING_STATUS.CHECKED_IN;
    booking.checkedInAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Guest checked in successfully.',
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const processCheckOut = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.status !== BOOKING_STATUS.CHECKED_IN) {
      return res.status(400).json({
        success: false,
        message: `Cannot check out booking with status '${booking.status}'.`
      });
    }

    booking.status = BOOKING_STATUS.CHECKED_OUT;
    booking.checkedOutAt = new Date();
    await booking.save();

    // Mark room as dirty and trigger housekeeping task
    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, {
        operationalStatus: ROOM_STATUS.DIRTY
      });

      await HousekeepingTask.create({
        hotelId: booking.hotelId,
        roomId: booking.roomId,
        priority: 'high',
        status: HOUSEKEEPING_STATUS.PENDING,
        notes: `Post checkout departure cleaning for room.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest checked out successfully and room dispatched to housekeeping.',
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const getHousekeepingTasks = async (req, res, next) => {
  try {
    const hotelId = req.user.hotelId || req.params.hotelId || req.query.hotelId;
    const { status } = req.query;

    const query = { hotelId };
    if (status) query.status = status;

    const tasks = await HousekeepingTask.find(query)
      .populate('roomId', 'roomNumber floor operationalStatus')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

export const createHousekeepingTask = async (req, res, next) => {
  try {
    const { hotelId, roomId, assignedTo, priority, notes } = req.body;
    const task = await HousekeepingTask.create({
      hotelId: hotelId || req.user.hotelId,
      roomId,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      notes: notes || ''
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const updateHousekeepingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const task = await HousekeepingTask.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (status) {
      task.status = status;
      if (status === HOUSEKEEPING_STATUS.COMPLETED) {
        task.completedAt = new Date();
        // Update room to clean
        await Room.findByIdAndUpdate(task.roomId, {
          operationalStatus: ROOM_STATUS.CLEAN
        });
      } else if (status === HOUSEKEEPING_STATUS.IN_PROGRESS) {
        await Room.findByIdAndUpdate(task.roomId, {
          operationalStatus: ROOM_STATUS.CLEANING
        });
      }
    }

    if (notes !== undefined) task.notes = notes;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const getServiceRequests = async (req, res, next) => {
  try {
    const hotelId = req.user.hotelId || req.query.hotelId;
    const query = {};

    if (req.user.role === 'guest') {
      query.guestId = req.user._id;
    } else if (hotelId) {
      query.hotelId = hotelId;
    }

    const requests = await ServiceRequest.find(query)
      .populate('bookingId', 'bookingReference')
      .populate('roomId', 'roomNumber')
      .populate('guestId', 'name phone email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

export const createServiceRequest = async (req, res, next) => {
  try {
    const { bookingId, requestType, description, priority } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      guestId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Active booking not found.'
      });
    }

    const serviceRequest = await ServiceRequest.create({
      hotelId: booking.hotelId,
      bookingId: booking._id,
      guestId: req.user._id,
      roomId: booking.roomId || null,
      requestType,
      description,
      priority: priority || 'medium'
    });

    res.status(201).json({ success: true, serviceRequest });
  } catch (err) {
    next(err);
  }
};

export const updateServiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, assignedTo } = req.body;

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    if (status) request.status = status;
    if (resolutionNotes) request.resolutionNotes = resolutionNotes;
    if (assignedTo) request.assignedTo = assignedTo;

    await request.save();

    res.status(200).json({ success: true, serviceRequest: request });
  } catch (err) {
    next(err);
  }
};
