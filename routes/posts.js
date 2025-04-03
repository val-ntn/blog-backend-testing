const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post (POST request)
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  try {
    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send('Error creating post');
  }
});

// Get all posts (GET request)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).send('Error fetching posts');
  }
});

module.exports = router;
