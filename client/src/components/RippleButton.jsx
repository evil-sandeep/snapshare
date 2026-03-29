import React from 'react';
import useRipple from '../hooks/useRipple';

const RippleButton = ({ children, className = '', onClick, ...props }) => {
  const { ripples, addRipple } = useRipple();

  const handleClick = (e) => {
    addRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`btn-primary ${className}`} 
      onClick={handleClick} 
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            transform: 'scale(0)',
            animation: 'ripple-animation 600ms linear',
            pointerEvents: 'none',
          }}
        />
      ))}
      {children}
    </button>
  );
};

export default RippleButton;
