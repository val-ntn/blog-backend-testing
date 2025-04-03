const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Create and export the Post model
module.exports = mongoose.model('Post', postSchema);
