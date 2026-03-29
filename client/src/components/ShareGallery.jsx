import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Copy, Download, CheckCircle, ExternalLink } from 'lucide-react';
import RippleButton from './RippleButton';

const ShareGallery = ({ uniqueId, onClose }) => {
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/gallery/${uniqueId}`;

  useEffect(() => {
    if (uniqueId) {
      QRCode.toDataURL(shareLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#00f3ff',
          light: '#00000000'
        }
      }, (err, url) => {
        if (!err) setQrCode(url);
      });
    }
  }, [uniqueId, shareLink]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `gallery-qr-${uniqueId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-card"
      style={{ 
        padding: '2rem', 
        border: '1px solid var(--neon-cyan)', 
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)', animation: 'scan 2s linear infinite' }} />
      
      <h3 style={{ fontFamily: 'var(--pixel-font)', color: 'var(--neon-cyan)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
        GENERATION_COMPLETE
      </h3>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: 'spring', delay: 0.3 }}
           style={{ 
             padding: '1rem', 
             background: 'rgba(255,255,255,0.02)', 
             borderRadius: '16px',
             border: '1px solid rgba(0, 243, 255, 0.3)'
           }}
        >
          {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '180px', height: '180px' }} />}
        </motion.div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '0.8rem', color: '#888', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {shareLink}
        </span>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyToClipboard}
          style={{ background: 'none', border: 'none', color: copied ? '#00ff00' : 'var(--neon-cyan)', cursor: 'pointer' }}
        >
          {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <RippleButton onClick={downloadQR} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Download size={16} /> DOWNLOAD_QR
        </RippleButton>
        <RippleButton onClick={() => window.open(shareLink, '_blank')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(157, 0, 255, 0.2)', borderColor: 'var(--neon-purple)' }}>
          <ExternalLink size={16} /> VISIT_GALLERY
        </RippleButton>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </motion.div>
  );
};

export default ShareGallery;
