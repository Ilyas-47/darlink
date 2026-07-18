import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorGlow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const springX = useSpring(ringX, springConfig);
  const springY = useSpring(ringY, springConfig);

  useEffect(() => {
    // Only activate on devices with pointer capability (no touchscreens)
    if (window.matchMedia('(max-width: 991px)').matches) return;
    
    document.body.classList.add('custom-cursor-active');
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Delay ring center
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);

    // Magnetic effect on hover elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.magnetic') ||
        target.onclick
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny solid dot cursor */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#DD7246',
          zIndex: 999999,
          pointerEvents: 'none',
          x: cursorX,
          y: cursorY,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Outer ring cursor */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1.5px solid #DD7246',
          zIndex: 999998,
          pointerEvents: 'none',
          x: springX,
          y: springY,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(221, 114, 70, 0.08)' : 'rgba(221, 114, 70, 0)',
          borderColor: isHovered ? '#DD7246' : 'rgba(221, 114, 70, 0.4)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </>
  );
};

export default CursorGlow;
