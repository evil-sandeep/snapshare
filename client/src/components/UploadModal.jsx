import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, ImageIcon, Send } from 'lucide-react';
import RippleButton from './RippleButton';
import ShareGallery from './ShareGallery';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('ANONYMOUS');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!imageUrl) return alert('Protocol Failure: Missing Image URL');
    setUploading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/images', {
        title: title || 'UNTITLED_DRIVE',
        imageUrl: imageUrl,
        author: author
      });
      setUploadResult(response.data);
    } catch (err) {
      console.error('System Error:', err);
      alert('UPLOAD_SYNC_FAILURE');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setUploadResult(null);
    setTitle('');
    setImageUrl('');
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
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <input 
                      type="text" 
                      placeholder="IMAGE_URL_HTTPS://..." 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ width: '100%', background: 'none', border: 'none', color: 'white', padding: '1.2rem', outline: 'none', fontFamily: 'var(--pixel-font)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '1rem' }}>
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

              <div 
                 className="pixel-border" 
                 style={{ 
                   height: '180px', 
                   background: 'rgba(255,255,255,0.01)', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   borderRadius: '12px',
                   marginBottom: '2rem',
                   border: '2px dashed rgba(255,255,255,0.05)',
                   overflow: 'hidden'
                 }}
              >
                 {imageUrl ? (
                   <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} onError={(e) => e.target.style.display = 'none'} />
                 ) : (
                    <>
                      <div style={{ color: 'var(--neon-cyan)', marginBottom: '1rem' }}>
                        <ImageIcon size={40} />
                      </div>
                      <p style={{ color: '#555', fontSize: '0.7rem', fontFamily: 'var(--pixel-font)' }}>PREVIEW_MODAL_ACTIVE</p>
                    </>
                 )}
              </div>

              <RippleButton 
                onClick={handleUpload} 
                disabled={uploading || !imageUrl} 
                style={{ width: '100%', opacity: (uploading || !imageUrl) ? 0.5 : 1 }}
              >
                 {uploading ? 'SYNCING...' : 'COMMAND: EXECUTE_UPLOAD'}
              </RippleButton>
              
              <p style={{ marginTop: '2rem', fontSize: '0.6rem', color: '#333', textAlign: 'center', fontFamily: 'var(--pixel-font)' }}>
                PROTOCOL: SH_SECURE_V4 // SNAP_SHARE_OS
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
