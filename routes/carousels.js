//backend/routes/carousels.js

import express from 'express';
import {
  createCarousel,
  getCarousels,
  getCarouselById,
  getDeletedCarousels,
  updateCarousel,
  softDeleteCarousel,    // added
  restoreCarousel,       // added
  hardDeleteCarousel     // added
} from '../controllers/carouselController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCarousels);
router.get('/bin', verifyToken, requireRole('admin'), getDeletedCarousels);
router.get('/:id', getCarouselById);
router.post('/', verifyToken, requireRole('admin'), createCarousel);
router.put('/:id', verifyToken, requireRole('admin'), updateCarousel);
router.delete('/:id', verifyToken, requireRole('admin'), softDeleteCarousel); // soft delete
router.patch('/restore/:id', verifyToken, requireRole('admin'), restoreCarousel); // restore
router.delete('/hard/:id', verifyToken, requireRole('admin'), hardDeleteCarousel); // hard delete

export default router;

