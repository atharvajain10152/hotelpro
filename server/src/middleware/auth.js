import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ROLES, USER_STATUS } from '../config/constants.js';

// Protect routes - verify user token
export const protect = async (req, res, next) => {
  let token;

  // Check Bearer token in header or cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_development_32chars_min'
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform administration.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

// Enforce hotel-level tenancy / scope for staff and managers
export const requireHotelScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  // Admin has global access to all hotels
  if (req.user.role === ROLES.ADMIN) {
    return next();
  }

  const requestedHotelId = req.params.hotelId || req.body.hotelId || req.query.hotelId;

  if (req.user.role === ROLES.MANAGER || req.user.role === ROLES.STAFF) {
    if (!req.user.hotelId) {
      return res.status(403).json({
        success: false,
        message: 'You have not been assigned to any hotel. Access denied.'
      });
    }

    if (requestedHotelId && requestedHotelId.toString() !== req.user.hotelId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view or manage another hotel.'
      });
    }
  }

  next();
};
