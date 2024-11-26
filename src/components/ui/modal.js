// components/ui/modal.js
import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body // Render modal to the body
  );
};

export default Modal;