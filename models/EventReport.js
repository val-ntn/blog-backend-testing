// models/EventReport.js
import mongoose from 'mongoose';

const eventReportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true, // A report must belong to an event
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  excerpt: { type: String, default: '' },
  tags: [{ type: String }],
  thumbnailURL: { type: String },
  externalLinks: [{ type: String }],
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

eventReportSchema.index({ event: 1 }, { unique: true });
eventReportSchema.index({ deleted: 1, createdAt: -1 });

// Same excerpt logic as Post
eventReportSchema.virtual('shortExcerpt').get(function () {
  const stripHTML = html => html.replace(/<[^>]+>/g, '');
  const generateExcerpt = (text, wordLimit = 40) =>
    text.split(' ').slice(0, wordLimit).join(' ') + '...';

  if (this.excerpt && this.excerpt.trim()) return this.excerpt;

  const plainText = stripHTML(this.content || '');
  return generateExcerpt(plainText);
});

eventReportSchema.pre('save', function (next) {
  if (!this.excerpt || !this.excerpt.trim()) {
    const plainText = this.content.replace(/<[^>]+>/g, '');
    this.excerpt = plainText.split(' ').slice(0, 40).join(' ') + '...';
  }
  next();
});

export default mongoose.model('EventReport', eventReportSchema);
