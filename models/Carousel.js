//backend/models/Carousel.js

import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: [String], // Array of image URLs or filenames
  deleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });

export default mongoose.model('Carousel', carouselSchema);

