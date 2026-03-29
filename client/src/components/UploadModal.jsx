import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, ImageIcon, Send, FileCode } from 'lucide-react';
import RippleButton from './RippleButton';
import ShareGallery from './ShareGallery';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('ANONYMOUS');
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Protocol Failure: No Image Selected');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title || 'UNTITLED_DRIVE');
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
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
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
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          backdropFilter: 'blur(15px)'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          style={{ width: '100%', maxWidth: '550px', cursor: 'default' }}
          onClick={(e) => e.stopPropagation()}
        >
          {uploadResult ? (
            <ShareGallery uniqueId={uploadResult.uniqueId} onClose={handleClose} />
          ) : (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--pixel-font)', letterSpacing: '2px' }}>
                  INITIALIZE_UPLOAD
                </h2>
                <button 
                  onClick={handleClose} 
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <input 
                        type="text" 
                        placeholder="DATA_TITLE" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <input 
                        type="text" 
                        placeholder="SOURCE_AUTHOR" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                 <button 
                   onClick={() => setShowSettings(!showSettings)}
                   style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontFamily: 'var(--pixel-font)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                 >
                   <FileCode size={14} /> {showSettings ? 'HIDE_SECURITY_DEFAULTS' : 'CONFIGURE_SECURITY_PROTOCOL'}
                 </button>
                 
                 <AnimatePresence>
                   {showSettings && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       style={{ overflow: 'hidden', marginTop: '1rem' }}
                     >
                       <div style={{ padding: '1rem', background: 'rgba(0, 243, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 243, 255, 0.1)', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                          <div>
                             <label style={{ fontSize: '0.6rem', color: '#555', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.5rem' }}>LINK_PROTECTION_PASS</label>
                             <input 
                               type="password" 
                               placeholder="OPTIONAL_HASH" 
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '8px', outline: 'none', fontSize: '0.8rem' }}
                             />
                          </div>
                          <div>
                             <label style={{ fontSize: '0.6rem', color: '#555', fontFamily: 'var(--pixel-font)', display: 'block', marginBottom: '0.5rem' }}>AUTO_EXPIRY (HRS)</label>
                             <select 
                               value={expiryHours}
                               onChange={(e) => setExpiryHours(e.target.value)}
                               style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '8px', outline: 'none', fontSize: '0.8rem' }}
                             >
                                <option value="">NEVER</option>
                                <option value="1">1_HOUR</option>
                                <option value="24">24_HOURS</option>
                                <option value="168">7_DAYS</option>
                             </select>
                          </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              
              {/* ... preview area ... */}
              <div 
                 className="pixel-border" 
                 onClick={() => fileInputRef.current?.click()}
                 style={{ 
                   height: '180px', 
                   background: 'rgba(255,255,255,0.01)', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   borderRadius: '12px',
                   marginBottom: '2rem',
                   border: '2px dashed rgba(0, 243, 255, 0.2)',
                   overflow: 'hidden',
                   cursor: 'pointer'
                 }}
              >
                 {previewUrl ? (
                   <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                    <>
                      <div style={{ color: 'var(--neon-cyan)', marginBottom: '1rem' }}>
                        <Upload size={32} />
                      </div>
                      <p style={{ color: '#888', fontSize: '0.6rem', fontFamily: 'var(--pixel-font)', textAlign: 'center' }}>
                        CHOOSE_PIXEL_SOURCE
                      </p>
                    </>
                 )}
              </div>

              <RippleButton 
                onClick={handleUpload} 
                disabled={uploading || !selectedFile} 
                style={{ width: '100%', opacity: (uploading || !selectedFile) ? 0.5 : 1 }}
              >
                 {uploading ? 'SYNCING...' : 'EXECUTE_SECURE_SYNC'}
              </RippleButton>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
