import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart, Share2, User } from 'lucide-react';
import RippleButton from './RippleButton';

const ImagePreviewModal = ({ isOpen, image, onClose }) => {
  if (!isOpen || !image) return null;

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
          background: 'rgba(5, 5, 5, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '2rem',
          backdropFilter: 'blur(15px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{ 
            maxWidth: '1200px', 
            width: '100%', 
            maxHeight: '90vh', 
            display: 'grid', 
            gridTemplateColumns: '1fr 350px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div style={{ position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', height: '100%' }}>
            <motion.img 
              layoutId={`image-${image._id}`}
              src={image.imageUrl} 
              alt={image.title} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Details Section */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ marginBottom: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>@{image.author}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#666', fontFamily: 'var(--pixel-font)' }}>SYSTEM.USER_VERIFIED</p>
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', lineHeight: 1.2 }}>{image.title}</h2>
              <p style={{ color: '#888', lineHeight: 1.6, fontSize: '0.9rem' }}>
                High-fidelity image capture retrieved from the SnapShare decentralized pixel network.
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                  <Heart size={18} color="#ff00ff" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>{image.likes}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                  <Share2 size={18} color="var(--neon-cyan)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>42</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <RippleButton 
                onClick={() => window.open(image.imageUrl, '_blank')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.2rem' }}
              >
                <Download size={20} /> INITIALIZE_DOWNLOAD
              </RippleButton>
              <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#444', marginTop: '1.5rem', fontFamily: 'var(--pixel-font)' }}>
                PROTOCOL: SH_SECURE_FETCH_V4
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
