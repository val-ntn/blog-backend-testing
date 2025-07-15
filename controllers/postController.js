import Post from '../models/Post.js';

// Create new post
export const createPost = async (req, res) => {
  const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;
  if (!title || !content) return res.status(400).send("Title and content required");

  try {
    const newPost = new Post({ title, content, author, category, tags, thumbnailURL, externalLinks });
    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    console.error('Post creation error:', err.message);
    res.status(400).json({ error: 'Error creating post', details: err.message });
  }
};

// Get all posts (not deleted)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts: ' + err.message });
  }
};

// Get all soft deleted posts
export const getDeletedPosts = async (req, res) => {
  try {
    const deletedPosts = await Post.find({ deleted: true }).sort({ createdAt: -1 });
    res.status(200).json(deletedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted posts: ' + err.message });
  }
};

// Get latest post
export const getLatestPost = async (req, res) => {
  try {
    const latestPost = await Post.findOne({ deleted: false }).sort({ createdAt: -1 });
    res.status(200).json(latestPost);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching latest post: ' + err.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post: ' + err.message });
  }
};

// Update post by ID
export const updatePost = async (req, res) => {
  try {
    const { title, content, author, category, tags, thumbnailURL, externalLinks } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, category, tags, thumbnailURL, externalLinks },
      { new: true, runValidators: true }
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post: ' + err.message });
  }
};

// Soft delete post by ID
export const softDeletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!deletedPost) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post: ' + err.message });
  }
};

// Restore soft deleted post
export const restorePost = async (req, res) => {
  try {
    const restoredPost = await Post.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!restoredPost) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post restored successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error restoring post: ' + err.message });
  }
};

// Hard delete post by ID
export const hardDeletePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error permanently deleting post: ' + err.message });
  }
};
