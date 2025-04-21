//posts.js

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post (POST request)
router.post('/', async (req, res) => {
  const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;
  if(!title || !content){
    return res.status(400).send("Title and content required");
  }
  
  try {
    const newPost = new Post({ title, content, author, category, tags, thumbnailURL, externalLinks });
    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    console.error('Post creation error:', err.message);
    res.status(400).json({ error: 'Error creating post', details: err.message });
  }
  
});

// Get all posts (GET request)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts: ' + err.message});
  }
});

//Get a single post by ID
router.get('/:id', async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ error: 'Post not found'});
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post: ' + err.message });
  }
})

// Update a post by ID

router.put('/:id', async (req, res) => {
  try {
    const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;
    if(!title || !content) {
      return res.status(400).json({ error: 'Title and content are required'});
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, category, tags, thumbnailURL, externalLinks },
      { new: true, runValidators: true }
    );
    if(!updatedPost){
      return res.status(404).json({ error: 'Post not found'});
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post: ' + err.message});
  }
});
// Delete a post by ID (DELETE request)
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post: ' + err.message });
  }
});

module.exports = router;
