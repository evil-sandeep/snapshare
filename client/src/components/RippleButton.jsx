import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRipple from '../hooks/useRipple';

const RippleButton = ({ children, className = '', onClick, style = {}, ...props }) => {
  const { ripples, addRipple } = useRipple();

  const handleClick = (e) => {
    addRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <motion.button 
      className={`btn-primary ${className}`} 
      onClick={handleClick} 
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid var(--neon-cyan)',
        ...style 
      }}
      {...props}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
};

export default RippleButton;

