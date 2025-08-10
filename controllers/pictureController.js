//backend/controllers/pictureController.js

/* import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

export const uploadPicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
};

export const listPictures = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Failed to list images' });

    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(name => ({ name }));

    res.json(images);
  });
};

export const deletePicture = (req, res) => {
  const { imageName } = req.params;
  const filepath = path.join(uploadDir, imageName);

  fs.unlink(filepath, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete image' });
    res.json({ message: 'Image deleted' });
  });
};
 */
