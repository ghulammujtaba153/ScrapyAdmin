import React, { useEffect, useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const SendPaymentLinkModal = ({ isOpen, onClose, user, onSend }) => {
    const [paymentLink, setPaymentLink] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPaymentLink('');
        }
    }, [isOpen, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentLink.trim()) {
            return;
        }

        setLoading(true);
        try {
            await onSend(paymentLink.trim());
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Send Payment Link</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Send a payment link to {user.name || user.email} for international verification.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">User</label>
                        <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
                            {user.name || 'Unnamed user'} <span className="text-gray-400">({user.email})</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Link</label>
                        <input
                            type="url"
                            value={paymentLink}
                            onChange={(e) => setPaymentLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            Paste the payment URL you want this user to complete.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !paymentLink.trim()}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaPaperPlane />
                            {loading ? 'Sending...' : 'Send Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendPaymentLinkModal;