import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.", 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "danger" // 'danger', 'primary', 'warning'
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-500 bg-red-50',
                    button: 'bg-red-500 hover:bg-red-600 shadow-red-200',
                };
            case 'warning':
                return {
                    icon: 'text-yellow-500 bg-yellow-50',
                    button: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200',
                };
            default:
                return {
                    icon: 'text-primary bg-primary/10',
                    button: 'bg-primary hover:bg-primary/90 shadow-primary/20',
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${styles.icon}`}>
                            <FaExclamationTriangle className="text-2xl" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-500 leading-relaxed">{message}</p>

                    <div className="flex gap-4 mt-8">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${styles.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
