
// backend/routes/events.js


import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getEvents,
  getDeletedEvents,
  getEventById,
  updateEvent,
  softDeleteEvent,
  restoreEvent,
  hardDeleteEvent,
  getUpcomingEvents,
} from '../controllers/eventController.js';

const router = express.Router();

// Admin: Create event
router.post('/', verifyToken, requireRole('admin'), createEvent);

// Public: Get all events
router.get('/', getEvents);

// Admin: Get deleted events
router.get('/bin', verifyToken, requireRole('admin'), getDeletedEvents);

//Public: Get upcomming events
router.get('/upcoming', getUpcomingEvents);

// Public: Get one event
router.get('/:id', getEventById);

// Admin: Update event
router.put('/:id', verifyToken, requireRole('admin'), updateEvent);

// Admin: Soft delete
router.delete('/:id', verifyToken, requireRole('admin'), softDeleteEvent);

// Admin: Restore event
router.patch('/restore/:id', verifyToken, requireRole('admin'), restoreEvent);

// Admin: Hard delete
router.delete('/hard/:id', verifyToken, requireRole('admin'), hardDeleteEvent);

export default router;
