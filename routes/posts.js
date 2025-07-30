//backend/routes/posts.js

import express from 'express';
import { 
  createPost,
  getPosts,
  getDeletedPosts,
  getLatestPost,
  getPostById,
  updatePost,
  softDeletePost,
  restorePost,
  hardDeletePost
} from '../controllers/postController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireRole('admin'), createPost);
router.get('/', getPosts);
router.get('/bin', verifyToken, requireRole('admin'), getDeletedPosts);
router.get('/latest', getLatestPost);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, requireRole('admin'), updatePost);
router.delete('/:id', verifyToken, requireRole('admin'), softDeletePost);
router.patch('/restore/:id', verifyToken, requireRole('admin'), restorePost);
router.delete('/hard/:id', verifyToken, requireRole('admin'), hardDeletePost);

export default router;