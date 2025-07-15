/* // routes/users.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET all users — typically used in admin dashboard to list users
router.get('/', async (req, res) => {
  try {
    // Query the database to find all user documents
    const users = await User.find();
    // Send the list of users as JSON response
    res.json(users);
  } catch (err) {
    // If an error occurs during the query, respond with HTTP 500 and error message
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router; */

//backend/routes/users.js

import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('admin'), getUsers);

export default router;


