// routes/events.js
import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Create a new event (POST request)
router.post('/', async (req, res) => {
  try {
    // Create a new Event document using request body data
    const newEvent = new Event(req.body);

    // Save the event to the database
    const saved = await newEvent.save();

    // Respond with created event and status 201
    res.status(201).json(saved);
  } catch (err) {
    // On error, respond with 400 Bad Request and error details
    res.status(400).json({ error: 'Error creating event', details: err.message });
  }
});

// Get all events (GET request)
router.get('/', async (req, res) => {
  try {
    // Find all events, sort by startDate ascending
    const events = await Event.find().sort({ startDate: 1 });

    // Respond with list of events
    res.status(200).json(events);
  } catch (err) {
    // Respond with 500 Internal Server Error if fetching fails
    res.status(500).json({ error: 'Error fetching events', details: err.message });
  }
});

// Get a single event by ID (GET request)
router.get('/:id', async (req, res) => {
  try {
    // Find event by ID from URL param
    const event = await Event.findById(req.params.id);

    // If not found, respond with 404 Not Found
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Respond with found event
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event', details: err.message });
  }
});

// Update an event by ID (PUT request)
router.put('/:id', async (req, res) => {
  try {
    // Update event document by ID with request body data
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // If event not found, respond 404
    if (!updated) return res.status(404).json({ error: 'Event not found' });

    // Respond with updated event
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating event', details: err.message });
  }
});

// Delete an event by ID (DELETE request)
router.delete('/:id', async (req, res) => {
  try {
    // Find and delete event by ID
    const deleted = await Event.findByIdAndDelete(req.params.id);

    // If event not found, respond 404
    if (!deleted) return res.status(404).json({ error: 'Event not found' });

    // Respond with success message
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event', details: err.message });
  }
});

export default router;
