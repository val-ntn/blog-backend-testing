//backend/controllers/carouselController.js

import Carousel from '../models/Carousel.js';


// GET all non-deleted carousels
export const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(carousels);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching carousels: ' + err.message });
  }
};
// GET single carousel
export const getCarouselById = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) return res.status(404).json({ error: 'Carousel not found' });
    res.json(carousel);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching carousel: ' + err.message });
  }
};

// POST create a carousel
export const createCarousel = async (req, res) => {
  const { title, images } = req.body;
  if (!title || !images?.length) return res.status(400).json({ error: 'Title and images required' });

  try {
    const newCarousel = new Carousel({ title, images });
    await newCarousel.save();
    res.status(201).json(newCarousel);
  } catch (err) {
    res.status(400).json({ error: 'Error creating carousel: ' + err.message });
  }
};

// PUT update carousel
export const updateCarousel = async (req, res) => {
  const { title, images } = req.body;
  try {
    const updated = await Carousel.findByIdAndUpdate(
      req.params.id,
      { title, images },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Carousel not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating carousel: ' + err.message });
  }
};



// Soft delete carousel by ID
export const softDeleteCarousel = async (req, res) => {
  try {
    const updated = await Carousel.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Carousel not found' });
    res.json({ message: 'Carousel soft deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error soft deleting carousel: ' + err.message });
  }
};

// Restore soft deleted carousel by ID
export const restoreCarousel = async (req, res) => {
  try {
    const updated = await Carousel.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Carousel not found' });
    res.json({ message: 'Carousel restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring carousel: ' + err.message });
  }
};

// Hard delete carousel by ID (optional)
export const hardDeleteCarousel = async (req, res) => {
  try {
    const deleted = await Carousel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Carousel not found' });
    res.json({ message: 'Carousel permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting carousel: ' + err.message });
  }
};

// Get all soft-deleted carousels
export const getDeletedCarousels = async (req, res) => {
  try {
    const deletedCarousels = await Carousel.find({ deleted: true }).sort({ createdAt: -1 });
    res.json(deletedCarousels);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted carousels: ' + err.message });
  }
};
