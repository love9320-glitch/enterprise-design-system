import React from 'react';

const variantStyles = {
  default:  'bg-white shadow-sm dark:bg-gray-800',
  bordered: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  flat:     'bg-gray-50 dark:bg-gray-900',
  elevated: 'bg-white shadow-lg dark:bg-gray-800',
};

export function Card({
  variant = 'default',
  hoverable = false,
  padding = true,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={[
        'rounded-xl overflow-hidden',
        variantStyles[variant],
        hoverable ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 ${className}`}>
      <div>
        {title && (
          <h3 className="text-body-md-semi text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-0.5 text-body-base text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className = '', children }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 ${className}`}>
      {children}
    </div>
  );
}
