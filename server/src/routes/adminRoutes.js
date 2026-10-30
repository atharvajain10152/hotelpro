import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateHotelApproval,
  getAuditLogs
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/hotels/:id/approval', updateHotelApproval);
router.get('/audit-logs', getAuditLogs);

export default router;

