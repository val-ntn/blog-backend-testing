const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },  
  tags: [{ type: String }],  
  views: { type: Number, default: 0 },  
  thumbnailURL: { type: String },  
  externalLinks: [{ type: String }] 
}, { timestamps: true });  

// Create and export the Post model
module.exports = mongoose.model('Post', postSchema);
