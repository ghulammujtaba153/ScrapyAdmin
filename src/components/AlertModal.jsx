import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const AlertModal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = "info" 
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <FaCheckCircle className="text-5xl text-green-500" />,
                    button: 'bg-green-500 hover:bg-green-600 shadow-green-200',
                };
            case 'error':
                return {
                    icon: <FaExclamationCircle className="text-5xl text-red-500" />,
                    button: 'bg-red-500 hover:bg-red-600 shadow-red-200',
                };
            default:
                return {
                    icon: <FaInfoCircle className="text-5xl text-blue-500" />,
                    button: 'bg-primary hover:bg-primary/90 shadow-primary/20',
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative text-center p-8">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes />
                </button>
                
                <div className="flex justify-center mb-6">
                    {styles.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed mb-8">{message}</p>

                <button 
                    onClick={onClose}
                    className={`w-full px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${styles.button}`}
                >
                    Okay
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
