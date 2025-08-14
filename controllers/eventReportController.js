// backend/controllers/eventReportController.js

import EventReport from "../models/EventReport.js";
import Event from "../models/Event.js";
import Carousel from "../models/Carousel.js";
import sanitizeHtml from "sanitize-html";
import htmlTruncate from "html-truncate";

// Helper to sanitize HTML content
function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "style"],
    },
  });
}

// CREATE REPORT
export const createEventReport = async (req, res) => {
  try {
    const { event: eventId, carousel, excerpt, content } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    // Ensure associated event exists and is not deleted
    const event = await Event.findOne({ _id: eventId, deleted: false });
    if (!event) {
      return res
        .status(400)
        .json({ error: "Event does not exist or is deleted" });
    }

    // Validate carousel if provided
    if (carousel) {
      const carouselExists = await Carousel.exists({ _id: carousel });
      if (!carouselExists)
        return res.status(400).json({ error: "Invalid carousel ID" });
    }

    const cleanContent = sanitizeContent(content);

    const cleanExcerpt =
      excerpt && excerpt.trim()
        ? sanitizeHtml(excerpt, { allowedTags: [], allowedAttributes: {} })
        : htmlTruncate(cleanContent, 300, { ellipsis: "..." });

    const report = new EventReport({
      ...req.body,
      content: cleanContent,
      excerpt: cleanExcerpt,
    });

    const saved = await report.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error creating report", details: err.message });
  }
};

// GET ALL REPORTS
export const getEventReports = async (req, res) => {
  try {
    const reports = await EventReport.find({ deleted: false })
      .populate("event", "title startDate")
      .populate("carousel");
    res.status(200).json(reports);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching reports", details: err.message });
  }
};

// GET REPORT BY ID
export const getEventReportById = async (req, res) => {
  try {
    const report = await EventReport.findById(req.params.id)
      .populate("event", "title startDate")
      .populate("carousel");
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.status(200).json(report);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching report", details: err.message });
  }
};

// GET LATEST REPORT
export const getLatestReport = async (req, res) => {
  try {
    const latestReport = await EventReport.findOne({ deleted: false })
      .sort({ createdAt: -1 })
      .populate("event", "title startDate")
      .populate("carousel");
    res.status(200).json(latestReport);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching latest report", details: err.message });
  }
};

// UPDATE REPORT
export const updateEventReport = async (req, res) => {
  try {
    const {
      event: eventId,
      content,
      excerpt,
      carousel,
      title,
      author,
      tags,
      thumbnail,
      teaser,
      externalLinks,
    } = req.body;

    // Validate event if provided
    if (eventId) {
      const eventExists = await Event.exists({ _id: eventId, deleted: false });
      if (!eventExists)
        return res
          .status(400)
          .json({ error: "Associated event not found or deleted" });
    }

    // Validate carousel if provided
    if (carousel) {
      const carouselExists = await Carousel.exists({ _id: carousel });
      if (!carouselExists)
        return res.status(400).json({ error: "Invalid carousel ID" });
    }

    const cleanContent = content ? sanitizeContent(content) : undefined;

    let cleanExcerpt;
    if (excerpt && excerpt.trim()) {
      cleanExcerpt = sanitizeHtml(excerpt, {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else if (cleanContent) {
      cleanExcerpt = htmlTruncate(cleanContent, 300, { ellipsis: "..." });
    }

    const updateData = {
      ...(title !== undefined && { title }),
      ...(cleanContent !== undefined && { content: cleanContent }),
      ...(cleanExcerpt !== undefined && { excerpt: cleanExcerpt }),
      ...(author !== undefined && { author }),
      ...(eventId !== undefined && { event: eventId }),
      ...(tags !== undefined && { tags }),
      ...(carousel !== undefined && { carousel }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(teaser !== undefined && { teaser }),
      ...(externalLinks !== undefined && { externalLinks }),
    };

    const updated = await EventReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) return res.status(404).json({ error: "Report not found" });
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating report", details: err.message });
  }
};

// SOFT DELETE
export const softDeleteEventReport = async (req, res) => {
  try {
    const deleted = await EventReport.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ error: "Report not found" });
    res.status(200).json({ message: "Report deleted (soft) successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting report: " + err.message });
  }
};

// HARD DELETE
export const hardDeleteEventReport = async (req, res) => {
  try {
    const deleted = await EventReport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Report not found" });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting report", details: err.message });
  }
};

// RESTORE REPORT
export const restoreEventReport = async (req, res) => {
  try {
    const report = await EventReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    const event = await Event.findById(report.event);
    if (!event || event.deleted) {
      return res.status(400).json({
        error: "Cannot restore report: associated event is deleted or missing",
      });
    }

    report.deleted = false;
    report.deletedByEvent = false;
    await report.save();

    res.status(200).json({ message: "Report restored successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error restoring report: " + err.message });
  }
};

// GET DELETED REPORTS
export const getDeletedEventReports = async (req, res) => {
  try {
    const deletedReports = await EventReport.find({ deleted: true })
      .populate("event", "title startDate")
      .populate("carousel");
    res.status(200).json(deletedReports);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching deleted reports: " + err.message });
  }
};
