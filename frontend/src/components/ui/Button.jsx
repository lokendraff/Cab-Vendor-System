import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Premium Button with golden/ghost/danger variants
 * @param {'gold'|'ghost'|'danger'} variant
 * @param {boolean} loading
 * @param {boolean} fullWidth
 */
const Button = ({
  children,
  variant = 'gold',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-xl font-semibold text-sm
    cursor-pointer select-none
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClass = {
    gold: 'btn-gold',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
