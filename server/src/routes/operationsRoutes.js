import express from 'express';
import {
  getDailyOverview,
  processCheckIn,
  processCheckOut,
  getHousekeepingTasks,
  createHousekeepingTask,
  updateHousekeepingTask,
  getServiceRequests,
  createServiceRequest,
  updateServiceRequest
} from '../controllers/operationsController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Operations & Daily Overview
router.get(
  '/overview',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  getDailyOverview
);
router.post(
  '/check-in',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  processCheckIn
);
router.post(
  '/check-out',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  processCheckOut
);

// Housekeeping
router.get(
  '/housekeeping',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  getHousekeepingTasks
);
router.post(
  '/housekeeping',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  createHousekeepingTask
);
router.patch(
  '/housekeeping/:id',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  updateHousekeepingTask
);

// Service Requests
router.get('/services', protect, getServiceRequests);
router.post('/services', protect, createServiceRequest);
router.patch(
  '/services/:id',
  protect,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
  updateServiceRequest
);

export default router;

