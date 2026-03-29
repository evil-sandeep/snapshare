import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileCode, CheckCircle2 } from 'lucide-react';
import RippleButton from './RippleButton';
import axios from 'axios';

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
      style={{ padding: '3rem', textAlign: 'center', border: '2px solid var(--neon-cyan)', boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)' }}
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
            CLOSE_TERMINAL
          </RippleButton>
        </div>
      </div>
    </motion.div>
  );
};

const UploadModal = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

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
    selectedFiles.forEach(file => {
       formData.append('images', file);
    });
    formData.append('title', title || 'UNTITLED_COLLECTION');
    formData.append('author', author);
    if (password) formData.append('password', password);
    if (expiryHours) formData.append('expiryHours', expiryHours);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadResult(response.data);
    } catch (err) {
      console.error('System Error:', err);
      alert('UPLOAD_SYNC_FAILURE: check server connection or Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setUploadResult(null);
    setTitle('');
    setPassword('');
    setShowSettings(false);
    setSelectedFiles([]);
    setPreviews([]);
    onClose();
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 30) return alert('PROTOCOL_ERROR: Maximum 30 images allowed.');
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          backdropFilter: 'blur(20px)'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          style={{ width: '100%', maxWidth: '650px', cursor: 'default' }}
          onClick={(e) => e.stopPropagation()}
        >
          {uploadResult ? (
            <ShareGallery 
               uniqueId={uploadResult.uniqueId} 
               qrCode={uploadResult.qrCode} 
               link={uploadResult.link}
               onClose={handleClose} 
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
                <button 
                  onClick={handleClose} 
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                  <X size={28} />
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <input 
                        type="text" 
                        placeholder="COLLECTION_TITLE" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <input 
                        type="text" 
                        placeholder="AUTHOR" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.85rem' }}
                      />
                    </div>
                </div>
              </div>

              <input 
                type="file" 
                multiple
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />

              <div 
                 className="drop-zone" 
                 onDragOver={onDragOver}
                 onDrop={onDrop}
                 onClick={() => fileInputRef.current?.click()}
                 style={{ 
                   minHeight: '260px', 
                   background: 'rgba(0, 243, 255, 0.02)', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   borderRadius: '24px',
                   marginBottom: '2.5rem',
                   border: '2px dashed rgba(0, 243, 255, 0.3)',
                   overflow: 'hidden',
                   cursor: 'pointer',
                   transition: '0.4s',
                   position: 'relative'
                 }}
              >
                 {previews.length > 0 ? (
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem', padding: '1.5rem', width: '100%' }}>
                      {previews.map((src, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ scale: 0 }} 
                           animate={{ scale: 1 }} 
                           style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                         >
                            <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         </motion.div>
                      ))}
                      {selectedFiles.length > previews.length && (
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem' }}>
                            +{selectedFiles.length - previews.length}
                         </div>
                      )}
                   </div>
                 ) : (
                    <>
                      <motion.div 
                         animate={{ y: [0, -10, 0] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem' }}
                      >
                        <Upload size={52} />
                      </motion.div>
                      <h3 style={{ margin: 0, fontFamily: 'var(--pixel-font)', fontSize: '1rem', color: 'white' }}>DRAG_PHOTO_HERE</h3>
                      <p style={{ color: '#555', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)', marginTop: '0.8rem' }}>
                         OR CLICK TO BROWSE_SOURCE
                      </p>
                    </>
                 )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <button 
                   onClick={() => setShowSettings(!showSettings)}
                   style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontFamily: 'var(--pixel-font)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                 >
                   <FileCode size={16} /> SECURITY_PROTOCOLS
                 </button>
                 <span style={{ fontSize: '0.6rem', color: '#333', fontFamily: 'var(--pixel-font)' }}>STATUS: READY_V1.2</span>
              </div>

              <AnimatePresence>
                 {showSettings && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     style={{ overflow: 'hidden', marginBottom: '2.5rem' }}
                   >
                     <div style={{ padding: '1.5rem', background: 'rgba(157, 0, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(157, 0, 255, 0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                           <label style={{ fontSize: '0.6rem', color: 'var(--neon-purple)', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.8rem' }}>ENCRYPTION_PASS</label>
                           <input 
                             type="password" 
                             placeholder="OPTIONAL_HASH" 
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', padding: '1rem', borderRadius: '10px', outline: 'none', fontSize: '0.85rem' }}
                           />
                        </div>
                        <div>
                           <label style={{ fontSize: '0.6rem', color: 'var(--neon-purple)', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.8rem' }}>AUTO_PURGE</label>
                           <select 
                             value={expiryHours}
                             onChange={(e) => setExpiryHours(e.target.value)}
                             style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', padding: '1rem', borderRadius: '10px', outline: 'none', fontSize: '0.85rem' }}
                           >
                              <option value="">RETAIN_DATA</option>
                              <option value="1">1_HOUR_LINK</option>
                              <option value="24">24_HOUR_LINK</option>
                              <option value="168">7_DAY_LINK</option>
                           </select>
                        </div>
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              <RippleButton 
                onClick={handleUpload} 
                disabled={uploading || selectedFiles.length === 0} 
                style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem', opacity: (uploading || selectedFiles.length === 0) ? 0.5 : 1 }}
              >
                 {uploading ? 'SYNCHRONIZING_BATCH...' : 'COMMAND: GENERATE_GALLERY_PROTOCOL'}
              </RippleButton>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
