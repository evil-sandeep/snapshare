import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import archiver from 'archiver';
import axios from 'axios';

import { CloudinaryStorage } from 'multer-storage-cloudinary';

import bcrypt from 'bcrypt';
import cron from 'node-cron';
import QRCode from 'qrcode';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer-Storage-Cloudinary Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'snapshare',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 1200, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

const imageItemSchema = new mongoose.Schema({
  url: String,
  title: String,
  publicId: String
});

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: 'UNTITLED_COLLECTION' },
  author: { type: String, default: 'ANONYMOUS' },
  uniqueId: { type: String, unique: true },
  images: [imageItemSchema],
  password: { type: String, default: null },
  expiresAt: { type: Date, default: null },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);
const Image = mongoose.model('Image', imageSchema); // Keep single image for feed if needed

// REAL MULTI-IMAGE UPLOAD ENTRANCE
app.post('/api/upload-gallery', upload.array('images', 30), async (req, res) => {
  try {
    const { title, author, password, expiryHours } = req.body;
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files provided' });

    const uniqueId = Math.random().toString(36).substring(2, 10);
    
    let hashedPassword = null;
    if (password) {
       hashedPassword = await bcrypt.hash(password, 10);
    }

    let expiresAt = null;
    if (expiryHours) {
       expiresAt = new Date();
       expiresAt.setHours(expiresAt.getHours() + parseInt(expiryHours));
    }

    const galleryImages = req.files.map(file => ({
       url: file.path,
       title: file.originalname,
       publicId: file.filename
    }));

    const newGallery = new Gallery({
      title: title || 'UNTITLED_COLLECTION',
      author: author || 'ANONYMOUS',
      uniqueId: uniqueId,
      images: galleryImages,
      password: hashedPassword,
      expiresAt: expiresAt
    });

    await newGallery.save();

    // Generate QR for the direct gallery link
    const galleryUrl = `http://localhost:5173/gallery/${uniqueId}`;
    const qrCode = await QRCode.toDataURL(galleryUrl);

    res.status(201).json({ 
       uniqueId: newGallery.uniqueId, 
       qrCode: qrCode,
       link: galleryUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findOneAndUpdate(
       { uniqueId: req.params.id }, 
       { $inc: { views: 1 } }, 
       { new: true }
    );
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
    
    if (gallery.password) {
       return res.json({ 
          protected: true, 
          uniqueId: gallery.uniqueId,
          title: gallery.title 
       });
    }

    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery/:id/verify', async (req, res) => {
  try {
     const { password } = req.body;
     const gallery = await Gallery.findOne({ uniqueId: req.params.id });
     if (!gallery) return res.status(404).json({ error: 'DATA_VOID' });
     const isValid = await bcrypt.compare(password, gallery.password);
     if (!isValid) return res.status(401).json({ error: 'AUTH_FAILED' });
     res.json(gallery);
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// Stats for all galleries
app.get('/api/stats', async (req, res) => {
  try {
     const stats = await Gallery.aggregate([
        { 
           $group: { 
              _id: null, 
              totalViews: { $sum: "$views" }, 
              totalDownloads: { $sum: "$downloads" },
              totalImages: { $sum: { $size: "$images" } },
              totalGalleries: { $sum: 1 }
           } 
        }
     ]);
     res.json(stats[0] || { totalViews: 0, totalDownloads: 0, totalImages: 0, totalGalleries: 0 });
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

app.post('/api/track/:id/:type', async (req, res) => {
  try {
     const { id, type } = req.params;
     const field = type === 'download' ? 'downloads' : 'views';
     await Image.findOneAndUpdate({ uniqueId: id }, { $inc: { [field]: 1 } });
     res.sendStatus(200);
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
