import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PixelLoader = ({ text = "RETRIEVING_DATA" }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
              backgroundColor: ['#00f3ff', '#9d00ff', '#00f3ff']
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              delay: i * 0.1 
            }}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              left: `${(i % 3) * 25}px`,
              top: `${Math.floor(i / 3) * 25}px`,
              borderRadius: '2px',
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: 'var(--pixel-font)', fontSize: '0.8rem', color: 'var(--neon-cyan)', letterSpacing: '4px' }}>
          {text}{dots}
        </p>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.6rem', color: '#333', letterSpacing: '2px' }}>
          PROTOCOL_SECURE_V4.2 // ENCRYPTED_CHANNEL_ACTIVE
        </p>
      </div>
    </div>
  );
};

export default PixelLoader;
