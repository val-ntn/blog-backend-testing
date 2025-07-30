//backend/routes/users.js

import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('admin'), getUsers);

export default router;


