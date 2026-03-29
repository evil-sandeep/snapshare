import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import archiver from 'archiver';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// For local development if DB isn't available, we'll use a mocked data approach or just check connection.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snapshare')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

const imageSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  author: String,
  uniqueId: { type: String, unique: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/images', async (req, res) => {
  try {
    const { title, imageUrl, author } = req.body;
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const newImage = new Image({ title, imageUrl, author, uniqueId });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/:id', async (req, res) => {
  try {
    const image = await Image.findOne({ uniqueId: req.params.id });
    if (!image) return res.status(404).json({ error: 'Gallery not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/download-all', async (req, res) => {
  try {
    const images = await Image.find();
    if (!images || images.length === 0) return res.status(404).send('No images found');

    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment(`snapshare-gallery-${Date.now()}.zip`);

    archive.pipe(res);

    for (const img of images) {
      try {
        const response = await axios({
          url: img.imageUrl,
          method: 'GET',
          responseType: 'stream'
        });
        const filename = `${img.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${img.uniqueId}.jpg`;
        archive.append(response.data, { name: filename });
      } catch (err) {
        console.error(`Error adding image ${img.imageUrl} to zip:`, err.message);
      }
    }

    archive.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/proxy-download', async (req, res) => {
  try {
    const { url, filename } = req.query;
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    });
    res.attachment(filename || 'download.jpg');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
