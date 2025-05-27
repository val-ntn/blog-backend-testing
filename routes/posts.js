//routes/posts.js

import express from 'express';
import Post from '../models/Post.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();


// Create a new post (POST request)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  // Destructure fields from request body
  const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;

  // Basic validation: title and content are required
  if (!title || !content) {
    return res.status(400).send("Title and content required");
  }

  try {
    // Create new Post document with provided data
    const newPost = new Post({ title, content, author, category, tags, thumbnailURL, externalLinks });

    // Save the post to the database
    await newPost.save();

    // Respond with created post and 201 Created status
    res.status(201).send(newPost);
  } catch (err) {
    // Log error and respond with 400 Bad Request and error details
    console.error('Post creation error:', err.message);
    res.status(400).json({ error: 'Error creating post', details: err.message });
  }
});

// Get all posts (GET request)
router.get('/', async (req, res) => {
  try {
    // Find all posts and sort them by createdAt descending (newest first)
    const posts = await Post.find({ deleted: false }).sort({ createdAt: -1 });

    // Respond with the array of posts as JSON
    res.status(200).json(posts);
  } catch (err) {
    // Handle errors with 500 Internal Server Error response
    res.status(500).json({ error: 'Error fetching posts: ' + err.message });
  }
});

// Get all soft-deleted posts
router.get('/bin', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const deletedPosts = await Post.find({ deleted: true }).sort({ createdAt: -1 });
    res.status(200).json(deletedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted posts: ' + err.message });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    // Find post by ID from URL param
    const post = await Post.findById(req.params.id);

    // If not found, return 404
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Return the found post as JSON
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post: ' + err.message });
  }
});

// Update a post by ID (PUT request)
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Find post by ID and update with new data
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, category, tags, thumbnailURL, externalLinks },
      { new: true, runValidators: true } // Return updated doc & run validators
    );

    // If no post found to update, return 404
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Return the updated post as JSON
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post: ' + err.message });
  }
});

// Delete a post by ID (DELETE request)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const postId = req.params.id;

    // Soft delete by setting deleted = true
    const deletedPost = await Post.findByIdAndUpdate(postId, { deleted: true }, { new: true });

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post: ' + err.message });
  }
});

// Restore soft-deleted post
router.patch('/restore/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const restoredPost = await Post.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!restoredPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring post: ' + err.message });
  }
});

// Permanently delete a post
router.delete('/hard/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error permanently deleting post: ' + err.message });
  }
});




export default router;
