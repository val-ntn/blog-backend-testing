//backend/controllers/uploadController.js

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Image from "../models/Image.js";
import uploadDir from "../config/uploadDir.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const uploadDir = path.join(__dirname, "../uploads");

export const uploadPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Save image info to MongoDB
    const imageDoc = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await imageDoc.save();

    res.json(imageDoc);
  } catch (err) {
    console.error("Error saving image document:", err);
    res.status(500).json({ message: "Failed to save image info" });
  }
};

export const listPictures = async (req, res) => {
  try {
    // Find all images not marked as deleted
    //const images = await Image.find({ deleted: false }).select("-__v").lean();
    const images = await Image.find({ deleted: false })
      .sort({ uploadedAt: -1 })
      .select("-__v")
      .lean();
    res.json(images);
  } catch (err) {
    console.error("Error listing images:", err);
    res.status(500).json({ message: "Failed to list images" });
  }
};

export const deletePicture = async (req, res) => {
  const { imageName } = req.params;

  try {
    // Find the image doc by filename
    const image = await Image.findOne({ filename: imageName });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Soft delete in MongoDB
    image.deleted = true;
    await image.save();

    // Optionally: physically delete file from disk here (or keep for safety)
    // Uncomment below to physically delete:

    res.json({ message: "Image soft deleted" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Failed to delete image" });
  }
};
// List deleted images (for recycle bin)
export const listDeletedPictures = async (req, res) => {
  try {
    const images = await Image.find({ deleted: true })
      .sort({ uploadedAt: -1 })
      .select("-__v")
      .lean();
    res.json(images);
  } catch (err) {
    console.error("Error listing deleted images:", err);
    res.status(500).json({ message: "Failed to list deleted images" });
  }
};

// Restore soft-deleted image
export const restorePicture = async (req, res) => {
  const { imageName } = req.params;
  try {
    const image = await Image.findOne({ filename: imageName, deleted: true });
    if (!image) {
      return res.status(404).json({ message: "Deleted image not found" });
    }
    image.deleted = false;
    await image.save();
    res.json({ message: "Image restored" });
  } catch (err) {
    console.error("Error restoring image:", err);
    res.status(500).json({ message: "Failed to restore image" });
  }
};

// Hard delete: permanently delete from DB and disk
export const hardDeletePicture = async (req, res) => {
  const { imageName } = req.params;
  try {
    const image = await Image.findOne({ filename: imageName });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete file from disk
    const filepath = path.join(uploadDir, imageName);
    // NOTE: fs.unlink is async but uses callbacks.
    // We could promisify it to use async/await for cleaner error handling,
    // but to keep it simple for now, we're just logging errors without awaiting.
    fs.unlink(filepath, (err) => {
      if (err) console.error("Failed to delete file from disk:", err);
    });

    // Remove from DB
    await Image.deleteOne({ filename: imageName });

    res.json({ message: "Image permanently deleted" });
  } catch (err) {
    console.error("Error hard deleting image:", err);
    res.status(500).json({ message: "Failed to permanently delete image" });
  }
};
