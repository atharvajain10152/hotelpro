import Hotel from '../models/Hotel.js';
import RoomCategory from '../models/RoomCategory.js';
import Review from '../models/Review.js';
import { HOTEL_STATUS, ROLES } from '../config/constants.js';

export const getHotels = async (req, res, next) => {
  try {
    const { destination, city, minRating, amenities, sort, page = 1, limit = 12 } = req.query;

    const query = { status: HOTEL_STATUS.ACTIVE };

    if (destination) {
      query.$or = [
        { name: { $regex: destination, $options: 'i' } },
        { city: { $regex: destination, $options: 'i' } },
        { state: { $regex: destination, $options: 'i' } },
        { description: { $regex: destination, $options: 'i' } }
      ];
    } else if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    let sortOption = { averageRating: -1, createdAt: -1 };
    if (sort === 'rating_desc') {
      sortOption = { averageRating: -1 };
    } else if (sort === 'rating_asc') {
      sortOption = { averageRating: 1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('managerId', 'name email phone');

    // Attach lowest starting room price for each hotel
    const hotelIds = hotels.map((h) => h._id);
    const minPrices = await RoomCategory.aggregate([
      { $match: { hotelId: { $in: hotelIds } } },
      { $group: { _id: '$hotelId', minPrice: { $min: '$basePrice' } } }
    ]);

    const priceMap = {};
    minPrices.forEach((mp) => {
      priceMap[mp._id.toString()] = mp.minPrice;
    });

    const hotelsWithPricing = hotels.map((h) => {
      const doc = h.toObject();
      doc.startingPrice = priceMap[h._id.toString()] || 3500;
      return doc;
    });

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      hotels: hotelsWithPricing
    });
  } catch (err) {
    next(err);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let hotel;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id).populate('managerId', 'name email phone');
    } else {
      hotel = await Hotel.findOne({ slug: id }).populate('managerId', 'name email phone');
    }

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const categories = await RoomCategory.find({ hotelId: hotel._id }).sort({ basePrice: 1 });
    const reviews = await Review.find({ hotelId: hotel._id, status: 'approved' })
      .populate('guestId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      hotel,
      categories,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const managerId = req.user.role === ROLES.MANAGER ? req.user._id : req.body.managerId;

    const hotelData = {
      ...req.body,
      country: req.body.country || 'India',
      managerId
    };

    const hotel = await Hotel.create(hotelData);

    res.status(201).json({
      success: true,
      hotel
    });
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    // Role check: Admin or the assigned Manager
    if (req.user.role === ROLES.MANAGER && hotel.managerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your assigned hotel.'
      });
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.status(200).json({
      success: true,
      hotel
    });
  } catch (err) {
    next(err);
  }
};

