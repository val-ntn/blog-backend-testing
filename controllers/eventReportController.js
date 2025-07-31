// backend/controllers/eventReportController.js

import EventReport from '../models/EventReport.js';
import Event from '../models/Event.js';

// Create new report
/* export const createEventReport = async (req, res) => {
  try {
    const report = new EventReport(req.body);
    const saved = await report.save();

    // Optionally push to Event (if you're keeping a reports array inside Event)
    // await Event.findByIdAndUpdate(saved.event, { $push: { reports: saved._id } });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating report', details: err.message });
  }
}; */


// Create new report
export const createEventReport = async (req, res) => {
  try {
    const { event: eventId } = req.body;

    // Check if event exists and is not deleted
    const event = await Event.findOne({ _id: eventId, deleted: false });
    if (!event) {
      return res.status(400).json({ error: 'Event does not exist or is deleted' });
    }

    const report = new EventReport(req.body);
    const saved = await report.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating report', details: err.message });
  }
};


// Get all reports
export const getEventReports = async (req, res) => {
  try {
    const reports = await EventReport.find({ deleted: false }).populate('event', 'title startDate');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reports', details: err.message });
  }
};

// Get single report
export const getEventReportById = async (req, res) => {
  try {
    const report = await EventReport.findById(req.params.id).populate('event', 'title startDate');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching report', details: err.message });
  }
};
// Get latest report
export const getLatestReport = async (req, res) => {
  try {
    const latestReport = await EventReport.findOne({ deleted: false }).sort({ createdAt: -1 }).populate('event', 'title startDate');
    res.status(200).json(latestReport);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching latest report', details: err.message });
  }
};

// Update report
export const updateEventReport = async (req, res) => {
  try {
    const updated = await EventReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating report', details: err.message });
  }
};

// Delete report
export const hardDeleteEventReport = async (req, res) => {
  try {
    const deleted = await EventReport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting report', details: err.message });
  }
};

export const softDeleteEventReport = async (req, res) => {
  try {
    const deleted = await EventReport.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!deleted) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json({ message: 'Report deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting report: ' + err.message });
  }
};

/* export const restoreEventReport = async (req, res) => {
  try {
    const restored = await EventReport.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!restored) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json({ message: 'Report restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring report: ' + err.message });
  }
}; */

export const restoreEventReport = async (req, res) => {
  try {
    const report = await EventReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Check if the associated event exists and is not deleted
    const event = await Event.findById(report.event);
    if (!event || event.deleted) {
      return res.status(400).json({ error: 'Cannot restore report: associated event is deleted or missing' });
    }

    // Proceed to restore the report
    report.deleted = false;
    report.deletedByEvent = false;
    await report.save();

    res.status(200).json({ message: 'Report restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring report: ' + err.message });
  }
};


export const getDeletedEventReports = async (req, res) => {
  try {
    const deletedReports = await EventReport.find({ deleted: true }).populate('event', 'title startDate');
    res.status(200).json(deletedReports);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted reports: ' + err.message });
  }
};
