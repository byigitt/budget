import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  noPadding?: boolean;
}

export default function Card({ title, children, className = '', footer, noPadding = false }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-cardHover transition-shadow duration-300 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
} 