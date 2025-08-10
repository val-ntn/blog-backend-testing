// backend/routes/upload.js

import express from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import {
  uploadPicture,
  listPictures,
  deletePicture,
  listDeletedPictures,
  restorePicture,
  hardDeletePicture,
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload image (admin only)

router.post(
  "/images",
  verifyToken,
  requireRole("admin"),
  (req, res, next) => {
    uploadMiddleware.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        // Handle Multer errors explicitly
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadPicture
);

router.get("/images/bin", listDeletedPictures); // List soft-deleted images

router.get("/images", listPictures); // Active images
router.patch("/images/restore/:imageName", restorePicture); // Restore image
router.delete("/images/hard/:imageName", hardDeletePicture); // Hard delete

router.delete("/images/:imageName", deletePicture); // Soft delete

export default router;
