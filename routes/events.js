/* // routes/events.js
import express from 'express';
import Event from '../models/Event.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new event (POST request) - admin only
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating event', details: err.message });
  }
});

// Get all non-deleted events (GET request)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ deleted: false }).sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events', details: err.message });
  }
});

// Get all soft-deleted events - ADMIN ONLY
router.get('/bin', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const deletedEvents = await Event.find({ deleted: true }).sort({ startDate: 1 });
    res.status(200).json(deletedEvents);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted events: ' + err.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event', details: err.message });
  }
});

// Update an event by ID - admin only
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating event', details: err.message });
  }
});

// Soft-delete an event by ID - admin only
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Event.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event', details: err.message });
  }
});

// Restore a soft-deleted event by ID - admin only
router.patch('/restore/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const restored = await Event.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!restored) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring event: ' + err.message });
  }
});

// Permanently delete an event by ID - admin only
router.delete('/hard/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error permanently deleting event: ' + err.message });
  }
});

export default router;
 */

// routes/events.js
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
} from '../controllers/eventController.js';

const router = express.Router();

// Admin: Create event
router.post('/', verifyToken, requireRole('admin'), createEvent);

// Public: Get all events
router.get('/', getEvents);

// Admin: Get deleted events
router.get('/bin', verifyToken, requireRole('admin'), getDeletedEvents);

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
