import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                {title && <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}
                {children}
            </div>
        </div>
    );
};

export default Modal;