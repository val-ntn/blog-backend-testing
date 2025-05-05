// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create Event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating event', details: err.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events', details: err.message });
  }
});

// Get one event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event', details: err.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating event', details: err.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event', details: err.message });
  }
});

module.exports = router;
