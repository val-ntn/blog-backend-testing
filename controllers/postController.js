//backend/controllers/postController.js
import Post from "../models/Post.js";
import sanitizeHtml from "sanitize-html";
import htmlTruncate from "html-truncate";
import Carousel from "../models/Carousel.js";

// Helper function to sanitize TinyMCE HTML content
function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "style"],
    },
  });
}

// Create new post
export const createPost = async (req, res) => {
  const {
    title,
    content,
    author,
    category,
    tags,
    thumbnail,
    externalLinks,
    excerpt,
    carousel,
    teaser,
  } = req.body;
  if (!title || !content)
    return res.status(400).send("Title and content required");

  try {
    // Sanitize content
    const cleanContent = sanitizeContent(content);

    // Validate carousel (if provided)
    if (carousel) {
      const exists = await Carousel.exists({ _id: carousel });
      if (!exists)
        return res.status(400).json({ error: "Invalid carousel ID" });
    }

    // Use provided excerpt, or generate it
    const cleanExcerpt =
      excerpt && excerpt.trim()
        ? sanitizeHtml(excerpt, { allowedTags: [], allowedAttributes: {} }) // plain text only
        : htmlTruncate(cleanContent, 300, { ellipsis: "..." });

    const newPost = new Post({
      title,
      content: cleanContent,
      excerpt: cleanExcerpt,
      author,
      category,
      tags,
      thumbnail,
      externalLinks,
      carousel,
      teaser,
    });

    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    console.error("Post creation error:", err.message);
    res
      .status(400)
      .json({ error: "Error creating post", details: err.message });
  }
};

// Get all posts (not deleted)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false })
      .sort({ createdAt: -1 })
      .populate("carousel");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts: " + err.message });
  }
};

// Get all soft deleted posts
export const getDeletedPosts = async (req, res) => {
  try {
    const deletedPosts = await Post.find({ deleted: true })
      .sort({
        createdAt: -1,
      })
      .populate("carousel");
    res.status(200).json(deletedPosts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching deleted posts: " + err.message });
  }
};

// Get latest post
export const getLatestPost = async (req, res) => {
  try {
    const latestPost = await Post.findOne({ deleted: false })
      .sort({
        createdAt: -1,
      })
      .populate("carousel");
    res.status(200).json(latestPost);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching latest post: " + err.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("carousel");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Error fetching post: " + err.message });
  }
};

// Update post by ID
export const updatePost = async (req, res) => {
  const {
    title,
    content,
    author,
    category,
    tags,
    thumbnail,
    externalLinks,
    excerpt,
    carousel,
    teaser,
  } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content are required" });

  try {
    const cleanContent = sanitizeContent(content);

    // Validate carousel (if provided)
    if (carousel) {
      const exists = await Carousel.exists({ _id: carousel });
      if (!exists)
        return res.status(400).json({ error: "Invalid carousel ID" });
    }

    const cleanExcerpt =
      excerpt && excerpt.trim()
        ? sanitizeHtml(excerpt, { allowedTags: [], allowedAttributes: {} })
        : htmlTruncate(cleanContent, 300, { ellipsis: "..." });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content: cleanContent,
        excerpt: cleanExcerpt,
        author,
        category,
        tags,
        thumbnail,
        externalLinks,
        carousel,
        teaser,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Error updating post: " + err.message });
  }
};

// Soft delete post by ID
export const softDeletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ message: "Post deleted (soft) successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting post: " + err.message });
  }
};

// Restore soft deleted post
export const restorePost = async (req, res) => {
  try {
    const restoredPost = await Post.findByIdAndUpdate(
      req.params.id,
      { deleted: false },
      { new: true }
    );
    if (!restoredPost) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ message: "Post restored successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error restoring post: " + err.message });
  }
};

// Hard delete post by ID
export const hardDeletePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ message: "Post permanently deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error permanently deleting post: " + err.message });
  }
};
