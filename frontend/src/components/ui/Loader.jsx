import React from 'react';
import { motion } from 'framer-motion';

/**
 * Orbital Golden Loader — Sci-fi style loading animation
 * Shows golden orbiting dots around a central ring
 */
const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', ring: 'w-6 h-6', dot: 'w-1.5 h-1.5' },
    md: { container: 'w-16 h-16', ring: 'w-12 h-12', dot: 'w-2 h-2' },
    lg: { container: 'w-24 h-24', ring: 'w-20 h-20', dot: 'w-3 h-3' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${s.container} flex items-center justify-center`}>
        {/* Outer pulsing ring */}
        <motion.div
          className={`absolute ${s.ring} rounded-full border border-gold-500/30`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Inner spinning ring */}
        <motion.div
          className={`${s.ring} rounded-full border-2 border-transparent border-t-gold-400 border-r-gold-600/50`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Orbiting dot */}
        <motion.div
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        >
          <div
            className={`${s.dot} rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,168,83,0.6)]`}
            style={{ transform: `translateY(-${size === 'lg' ? 36 : size === 'md' ? 24 : 14}px)` }}
          />
        </motion.div>
      </div>

      {text && (
        <motion.p
          className="text-sm text-gray-400 font-medium tracking-wider"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
