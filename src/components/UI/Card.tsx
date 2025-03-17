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
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
} 