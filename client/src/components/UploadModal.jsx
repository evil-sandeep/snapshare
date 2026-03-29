import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, ImageIcon } from 'lucide-react';
import RippleButton from './RippleButton';

const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          className="glass-card"
          style={{ width: '100%', maxWidth: '500px', cursor: 'default' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>NEW_UPLOAD</h2>
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <div 
             className="pixel-border" 
             style={{ 
               height: '250px', 
               background: 'rgba(255,255,255,0.02)', 
               display: 'flex', 
               flexDirection: 'column', 
               alignItems: 'center', 
               justifyContent: 'center',
               borderRadius: '12px',
               marginBottom: '2rem',
               borderStyle: 'dashed'
             }}
          >
             <div style={{ color: 'var(--neon-cyan)', marginBottom: '1rem' }}>
                <Upload size={48} />
             </div>
             <p style={{ color: '#888', textAlign: 'center' }}>DRAG_AND_DROP <br/> OR CLICK TO BROWSE</p>
          </div>

          <RippleButton style={{ width: '100%' }}>
             INITIALIZE_SYNC
          </RippleButton>
          
          <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#444', textAlign: 'center' }}>
            PROTOCOL: SH_SECURE_V4 // PIXEL_ENCRYPTED
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
