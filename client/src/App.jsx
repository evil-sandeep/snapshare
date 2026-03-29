import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Upload, FileCode, ShieldCheck, ArrowLeft, Zap, Download, Maximize2, Heart, Share2, Menu, Search, Github, Eye, TrendingUp, Filter } from 'lucide-react';
import Masonry from 'react-masonry-css';
import RippleButton from './components/RippleButton';
import GalleryPage from './pages/GalleryPage';
import axios from 'axios';

// --- SHARED COMPONENTS ---

const ShareGallery = ({ uniqueId, qrCode, link, onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card"
      style={{ padding: '3rem', textAlign: 'center', border: '2px solid var(--neon-cyan)', boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)', maxWidth: '500px', margin: '0 auto' }}
    >
      <div style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem' }}>
        <CheckCircle2 size={48} />
      </div>
      <h2 style={{ fontFamily: 'var(--pixel-font)', fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '4px' }}>UPLOAD_SUCCESSFUL</h2>
      <p style={{ color: '#555', fontSize: '0.7rem', marginBottom: '2rem', fontFamily: 'var(--pixel-font)' }}>GALLERY_PROTOCOL_ID: {uniqueId}</p>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', marginBottom: '2rem', boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
        <img src={qrCode} alt="Gallery QR" style={{ width: '180px', height: '180px', display: 'block' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#888', wordBreak: 'break-all', fontFamily: 'monospace' }}>
          {link}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <RippleButton onClick={handleCopy} style={{ fontSize: '0.8rem' }}>
            {copied ? 'LINK_COPIED!' : 'COPY_GALLERY_LINK'}
          </RippleButton>
          <RippleButton onClick={onClose} style={{ background: 'none', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', fontSize: '0.8rem' }}>
            RESET_ENGINE
          </RippleButton>
        </div>
      </div>
    </motion.div>
  );
};

const MainUploadModule = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('ANONYMOUS');
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 30) return alert('PROTOCOL_ERROR: Maximum 30 images allowed.');
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return alert('Protocol Failure: No Images Selected');
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    formData.append('title', title || 'UNTITLED_COLLECTION');
    formData.append('author', author);
    if (password) formData.append('password', password);
    if (expiryHours) formData.append('expiryHours', expiryHours);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(response.data);
    } catch (err) {
      alert('UPLOAD_SYNC_FAILURE');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setUploadResult(null);
    setSelectedFiles([]);
    setPreviews([]);
    setTitle('');
    setPassword('');
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 30) return alert('PROTOCOL_ERROR');
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {uploadResult ? (
        <ShareGallery 
          uniqueId={uploadResult.uniqueId} 
          qrCode={uploadResult.qrCode} 
          link={uploadResult.link} 
          onClose={handleReset} 
        />
      ) : (
        <div className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
               <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--pixel-font)', letterSpacing: '4px' }}>
                 DATA_BATCH_UPLOAD
               </h2>
               <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.65rem', color: '#555', fontFamily: 'var(--pixel-font)' }}>MAX_CAPACITY: 30_UNITS</p>
            </div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)' }}>READY_V1.1</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="text" placeholder="COLLECTION_TITLE" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.85rem' }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="text" placeholder="AUTHOR" value={author} onChange={(e) => setAuthor(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.85rem' }} />
            </div>
          </div>

          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div 
             onDragOver={onDragOver} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}
             style={{ minHeight: '260px', background: 'rgba(0, 243, 255, 0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', marginBottom: '2.5rem', border: '2px dashed rgba(0, 243, 255, 0.3)', cursor: 'pointer', transition: '0.4s' }}
          >
             {previews.length > 0 ? (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem', padding: '1.5rem', width: '100%' }}>
                  {previews.map((src, i) => (
                     <div key={i} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                  ))}
               </div>
             ) : (
                <>
                  <Upload size={52} color="var(--neon-cyan)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ margin: 0, fontFamily: 'var(--pixel-font)', fontSize: '1rem', color: 'white' }}>DRAG_PHOTO_HERE</h3>
                  <p style={{ color: '#555', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)', marginTop: '0.8rem' }}>OR CLICK TO BROWSE_SOURCE</p>
                </>
             )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
             <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontFamily: 'var(--pixel-font)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
               <FileCode size={16} /> SECURITY_PROTOCOLS
             </button>
          </div>

          <AnimatePresence>
             {showSettings && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
                 <div style={{ padding: '1.5rem', background: 'rgba(157, 0, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(157, 0, 255, 0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                       <label style={{ fontSize: '0.6rem', color: 'var(--neon-purple)', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.8rem' }}>ENCRYPTION_PASS</label>
                       <input type="password" placeholder="OPTIONAL_HASH" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', padding: '1rem', borderRadius: '10px', outline: 'none' }} />
                    </div>
                    <div>
                       <label style={{ fontSize: '0.6rem', color: 'var(--neon-purple)', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.8rem' }}>AUTO_PURGE</label>
                       <select value={expiryHours} onChange={(e) => setExpiryHours(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', padding: '1rem', borderRadius: '10px', outline: 'none' }}>
                          <option value="">RETAIN_DATA</option>
                          <option value="1">1_HOUR</option>
                          <option value="24">24_HOURS</option>
                       </select>
                    </div>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>

          <RippleButton onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} style={{ width: '100%', padding: '1.5rem' }}>
             {uploading ? 'SYNCHRONIZING...' : 'COMMAND: GENERATE_GALLERY_PROTOCOL'}
          </RippleButton>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGES ---

const HomePage = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ fontFamily: 'var(--pixel-font)', letterSpacing: '4px', fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>SNAP_SHARE</div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.7rem', color: '#444', fontFamily: 'var(--pixel-font)' }}>
          <div>SYSTEM READY_V1.1</div>
          <div>STATUS: ONLINE_SECURE</div>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: '2rem' }}>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <MainUploadModule />
         </motion.div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: '#111', fontSize: '0.6rem', fontFamily: 'var(--pixel-font)', letterSpacing: '2px' }}>
         PROTOCOL_ACTIVE // ENCRYPTION_LAYER_6 // SNAP_SHARE_QUANTUM_CORE
      </footer>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery/:id" element={<GalleryPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
