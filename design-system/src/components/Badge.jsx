import React from 'react';
import { X } from 'lucide-react';

const variantStyles = {
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  yellow:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  red:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  gray:    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  indigo:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
};

const dotColors = {
  blue:   'bg-blue-500',
  green:  'bg-emerald-500',
  yellow: 'bg-amber-500',
  red:    'bg-red-500',
  purple: 'bg-purple-500',
  gray:   'bg-gray-500',
  indigo: 'bg-indigo-500',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-1.5',
};

export function Badge({
  variant = 'blue',
  size = 'md',
  dot = false,
  onRemove,
  children,
  className = '',
}) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 focus:outline-none transition-opacity"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
