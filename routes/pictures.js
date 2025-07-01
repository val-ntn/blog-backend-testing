//backend/routes/pictures.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.join(__dirname, '../uploads');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload picture route
router.post('/upload', upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});


// GET /api/pictures - list all uploaded images
router.get('/', (req, res) => {

fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Failed to list images' });

    // Filter only image files (optional)
    const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(name => ({ name }));

    res.json(images);
  });
});



// DELETE route example (you may already have this)
router.delete('/:imageName', (req, res) => {
  const { imageName } = req.params;
  const filepath = path.join(uploadDir, imageName); // <-- use absolute path here

  fs.unlink(filepath, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete image' });
    res.json({ message: 'Image deleted' });
  });
});

export default router;

