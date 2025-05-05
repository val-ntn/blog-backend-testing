// Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },                   // e.g. "Art Fair 2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date },                                   // optional if it's a single-day event
  location: { type: String },
  contact: { type: String },                                 // could be email, phone, or name
  schedule: { type: String },                                // e.g., "10:00–18:00 daily"
  costs: { type: String },                                   // e.g., "Free", "€10", etc.
  source: { type: String },                                  // e.g., external website link
  iconURL: { type: String },                                 // small image/icon
  imageURL: { type: String },                                // main visual/image
  description: { type: String },                             // optional detailed description
  relatedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
