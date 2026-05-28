import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const stateStyles = {
  default: 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400',
  error:   'border-red-400 focus:border-red-500 focus:ring-red-500 pr-10 dark:border-red-500',
  success: 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500 pr-10 dark:border-emerald-500',
};

export function Input({
  label,
  helperText,
  state = 'default',
  type = 'text',
  leftAddon,
  rightAddon,
  leftIcon: LeftIcon,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-comp-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAddon && (
          <span className="inline-flex items-center px-3 h-10 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {leftAddon}
          </span>
        )}

        {LeftIcon && (
          <span className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none">
            <LeftIcon size={16} />
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          className={[
            'w-full h-10 px-3 text-comp-sm rounded-lg border bg-white',
            'transition-colors duration-150',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            'dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
            'dark:disabled:bg-gray-900',
            leftAddon ? 'rounded-l-none' : '',
            rightAddon ? 'rounded-r-none' : '',
            LeftIcon ? 'pl-9' : '',
            stateStyles[state],
          ].join(' ')}
          {...props}
        />

        {state === 'error' && !isPassword && (
          <span className="absolute right-3 text-red-500 pointer-events-none">
            <AlertCircle size={16} />
          </span>
        )}
        {state === 'success' && !isPassword && (
          <span className="absolute right-3 text-emerald-500 pointer-events-none">
            <CheckCircle2 size={16} />
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {rightAddon && (
          <span className="inline-flex items-center px-3 h-10 rounded-r-lg border border-l-0 border-gray-300 bg-gray-100 text-gray-500 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {rightAddon}
          </span>
        )}
      </div>

      {helperText && (
        <p className={`text-xs ${
          state === 'error'   ? 'text-red-500 dark:text-red-400' :
          state === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
          'text-gray-500 dark:text-gray-400'
        }`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
