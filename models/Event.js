const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  thumbnailURL: String,
  relatedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
