// backend/routes/eventReports.js


import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import {
  createEventReport,
  getEventReports,
  getEventReportById,
  getLatestReport,
  updateEventReport,
  hardDeleteEventReport,        // hard
  softDeleteEventReport,
  restoreEventReport,
  getDeletedEventReports,
} from '../controllers/eventReportController.js';

const router = express.Router();

// Public routes
router.get('/', getEventReports);         
router.get('/latest', getLatestReport);    

// Admin routes
router.get('/bin', verifyToken, requireRole('admin'), getDeletedEventReports);

// Public dynamic route
router.get('/:id', getEventReportById);         

// Admin routes
router.post('/', verifyToken, requireRole('admin'), createEventReport);
router.patch('/restore/:id', verifyToken, requireRole('admin'), restoreEventReport);
router.delete('/:id', verifyToken, requireRole('admin'), softDeleteEventReport);
router.delete('/hard/:id', verifyToken, requireRole('admin'), hardDeleteEventReport);
router.put('/:id', verifyToken, requireRole('admin'), updateEventReport);

export default router;

