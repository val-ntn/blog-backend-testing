//backend/controllers/eventController.js

import Event from '../models/Event.js';
import EventReport from '../models/EventReport.js';


export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating event', details: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ deleted: false }).sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events', details: err.message });
  }
};

export const getDeletedEvents = async (req, res) => {
  try {
    const deletedEvents = await Event.find({ deleted: true }).sort({ startDate: 1 });
    res.status(200).json(deletedEvents);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted events: ' + err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event', details: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating event', details: err.message });
  }
};

/* export const softDeleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event', details: err.message });
  }
}; */

export const softDeleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Soft-delete event
    await Event.findByIdAndUpdate(eventId, { deleted: true });

    // Soft-delete related reports
 await EventReport.updateMany(
  { event: eventId, deleted: false }, // only affect non-deleted reports
  { deleted: true, deletedByEvent: true }
);



    res.status(200).json({ message: 'Event and related reports soft-deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event', details: err.message });
  }
};

/* export const restoreEvent = async (req, res) => {
  try {
    const restored = await Event.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!restored) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring event: ' + err.message });
  }
};
 */
export const restoreEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Restore the event
    const restoredEvent = await Event.findByIdAndUpdate(
      eventId,
      { deleted: false },
      { new: true }
    );
    if (!restoredEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Restore related reports
    await EventReport.updateMany(
  { event: eventId, deleted: true, deletedByEvent: true },
  { deleted: false, deletedByEvent: false }
);


    res.status(200).json({ message: 'Event and related reports restored successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring event', details: err.message });
  }
};


/* export const hardDeleteEvent = async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error permanently deleting event: ' + err.message });
  }
};
 */
export const hardDeleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Hard-delete related reports first
    await EventReport.deleteMany({ event: eventId });

    // Then delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: 'Event and related reports permanently deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event permanently', details: err.message });
  }
};


export const getUpcomingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // default: no limit
    const now = new Date();

    const events = await Event.find({
      startDate: { $gte: now },
      deleted: false,
    })
      .sort({ startDate: 1 }) // soonest first
      .limit(limit);

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching upcoming events', details: err.message });
  }
};
