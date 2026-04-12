import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Premium Input with space dark theme and golden focus glow
 * Supports text, email, password (with toggle), number, select
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  error,
  icon: Icon,
  options,       // For select type: [{ value, label }]
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300 tracking-wide">
          {label}
          {required && <span className="text-gold-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}

        {/* Select or Input */}
        {options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`
              w-full input-space rounded-xl py-3 px-4
              ${Icon ? 'pl-11' : ''}
              appearance-none cursor-pointer
            `}
            {...props}
          >
            <option value="" disabled className="bg-space-800 text-gray-400">
              {placeholder || 'Select...'}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-space-800 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`
              w-full input-space rounded-xl py-3 px-4
              ${Icon ? 'pl-11' : ''}
              ${isPassword ? 'pr-11' : ''}
            `}
            {...props}
          />
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs mt-1 pl-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
