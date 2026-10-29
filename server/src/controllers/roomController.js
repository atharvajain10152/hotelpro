import RoomCategory from '../models/RoomCategory.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { BookingService } from '../services/bookingService.js';
import { PricingService } from '../services/pricingService.js';

export const getCategoriesByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const categories = await RoomCategory.find({ hotelId }).sort({ basePrice: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (err) {
    next(err);
  }
};

export const checkAvailability = async (req, res, next) => {
  try {
    const { hotelId, categoryId } = req.params;
    const { checkInDate, checkOutDate, adults = 1, children = 0, couponCode } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both checkInDate and checkOutDate.'
      });
    }

    const availability = await BookingService.checkCategoryAvailability({
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate
    });

    let pricing = null;
    if (availability.isAvailable) {
      pricing = PricingService.calculatePricing({
        basePrice: availability.category.basePrice,
        checkInDate,
        checkOutDate,
        adults: Number(adults),
        children: Number(children),
        couponCode
      });
    }

    res.status(200).json({
      success: true,
      availability,
      pricing
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { name, description, basePrice, capacity, bedType, roomSizeSqFt, amenities, images, totalRooms } =
      req.body;

    const category = await RoomCategory.create({
      hotelId,
      name,
      description,
      basePrice,
      capacity,
      bedType,
      roomSizeSqFt,
      amenities,
      images,
      totalRooms: totalRooms || 5
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await RoomCategory.findByIdAndUpdate(categoryId, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { status, categoryId } = req.query;

    const query = { hotelId };
    if (status) query.operationalStatus = status;
    if (categoryId) query.categoryId = categoryId;

    const rooms = await Room.find(query)
      .populate('categoryId', 'name basePrice bedType')
      .sort({ roomNumber: 1 });

    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    next(err);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { categoryId, roomNumber, floor, notes } = req.body;

    const existingRoom = await Room.findOne({ hotelId, roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number '${roomNumber}' already exists in this hotel.`
      });
    }

    const room = await Room.create({
      hotelId,
      categoryId,
      roomNumber,
      floor: floor || 1,
      notes: notes || ''
    });

    res.status(201).json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

export const updateRoomStatus = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { operationalStatus, notes, isActive } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (operationalStatus) room.operationalStatus = operationalStatus;
    if (notes !== undefined) room.notes = notes;
    if (isActive !== undefined) room.isActive = isActive;

    await room.save();

    res.status(200).json({ success: true, room });
  } catch (err) {
    next(err);
  }
};
