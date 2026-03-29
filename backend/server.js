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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

const imageSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  author: String,
  uniqueId: { type: String, unique: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  password: { type: String, default: null }, // Hashed password
  expiresAt: { type: Date, default: null },   // Expiry date
  autoDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

// AUTO-DELETE CRON JOB (Runs every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const expired = await Image.find({ expiresAt: { $lte: now } });
    
    for (const img of expired) {
       // Optional: Delete from Cloudinary here if needed
       // await cloudinary.uploader.destroy(publicId);
       await Image.findByIdAndDelete(img._id);
       console.log(`DELETED_EXPIRED_DATA: ${img.uniqueId}`);
    }
  } catch (err) {
    console.error('CRON_FAILURE:', err);
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snapshare')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Existing image feed
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    // Don't leak passwords or expiry details on public feed
    const sanitized = images.map(img => ({
       ...img._doc,
       hasPassword: !!img.password
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REAL IMAGE UPLOAD ENTRANCE
app.post('/api/upload-gallery', upload.single('image'), async (req, res) => {
  try {
    const { title, author, password, expiryHours } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

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

    const newImage = new Image({
      title: title || 'UNTITLED_DRIVE',
      imageUrl: req.file.path,
      author: author || 'ANONYMOUS',
      uniqueId: uniqueId,
      password: hashedPassword,
      expiresAt: expiresAt,
      autoDelete: !!expiresAt
    });

    await newImage.save();
    res.status(201).json({ uniqueId: newImage.uniqueId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/:id', async (req, res) => {
  try {
    const image = await Image.findOneAndUpdate(
       { uniqueId: req.params.id }, 
       { $inc: { views: 1 } }, 
       { new: true }
    );
    if (!image) return res.status(404).json({ error: 'Gallery not found' });
    
    // Check if password protected
    if (image.password) {
       return res.json({ 
          protected: true, 
          uniqueId: image.uniqueId,
          title: image.title 
       });
    }

    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PASS_VERIFY_PROTOCOL
app.post('/api/gallery/:id/verify', async (req, res) => {
  try {
     const { password } = req.body;
     const image = await Image.findOne({ uniqueId: req.params.id });
     
     if (!image) return res.status(404).json({ error: 'DATA_VOID' });
     
     const isValid = await bcrypt.compare(password, image.password);
     if (!isValid) return res.status(401).json({ error: 'AUTH_FAILED' });
     
     res.json(image);
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// Analytics Route
app.get('/api/stats', async (req, res) => {
  try {
     const stats = await Image.aggregate([
        { 
           $group: { 
              _id: null, 
              totalViews: { $sum: "$views" }, 
              totalDownloads: { $sum: "$downloads" },
              totalImages: { $sum: 1 }
           } 
        }
     ]);
     res.json(stats[0] || { totalViews: 0, totalDownloads: 0, totalImages: 0 });
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
