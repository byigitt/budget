import { Fragment, ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore scrolling when modal closes
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Get size class
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  if (!isOpen) return null;

  return createPortal(
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div 
          className={`bg-transparent w-full ${sizeClass} animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-xl shadow-xl bg-gray-800 text-white">
            {/* Header */}
            {title && (
              <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Content */}
            <div className={title ? '' : 'pt-4'}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
} 