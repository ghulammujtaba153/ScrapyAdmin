import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/url';

const PackageModal = ({ isOpen, onClose, pkg, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        interval: 'month',
        stripePriceId: '',
        features: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pkg) {
            setFormData({
                name: pkg.name || '',
                description: pkg.description || '',
                price: pkg.price || '',
                interval: pkg.interval || 'month',
                stripePriceId: pkg.stripePriceId || '',
                features: pkg.features ? pkg.features.join(', ') : ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                interval: 'month',
                stripePriceId: '',
                features: ''
            });
        }
    }, [pkg, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
            };

            let res;
            if (pkg) {
                res = await axios.put(`${BASE_URL}/packages/${pkg._id}`, payload);
            } else {
                res = await axios.post(`${BASE_URL}/packages`, payload);
            }
            onSave(res.data.package);
            onClose();
        } catch (error) {
            console.error("Error saving package", error);
            alert(error.response?.data?.message || "Failed to save package");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-lg mx-auto my-6 px-4">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none transform transition-all scale-100">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-solid border-gray-100 rounded-t">
                        <h3 className="text-2xl font-bold text-gray-800">
                            {pkg ? 'Edit Package' : 'Create New Package'}
                        </h3>
                        <button
                            className="p-1 ml-auto border-0 text-gray-400 hover:text-gray-600 transition-colors outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="text-3xl block h-8 w-8 leading-none">
                                ×
                            </span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-6 flex-auto max-h-[75vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Package Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="e.g. Pro Plan"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Billing Interval</label>
                                    <select
                                        name="interval"
                                        value={formData.interval}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                                    >
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                        <option value="week">Weekly</option>
                                        <option value="one-time">One Time</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                    placeholder="Briefly describe what this package offers..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Features</label>
                                <p className="text-xs text-gray-500 mb-2">Separate features with commas (e.g., "Full Access, 24/7 Support")</p>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Stripe Price ID <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    name="stripePriceId"
                                    value={formData.stripePriceId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-mono text-sm"
                                    placeholder="price_123xyz..."
                                />
                            </div>

                            {/* Footer actions inside form so enter works */}
                            <div className="flex items-center justify-end pt-6 mt-6 border-t border-solid border-gray-100">
                                <button
                                    className="text-gray-500 hover:text-gray-700 font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-2 transition-colors"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-sm px-8 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none transition-all transform hover:-translate-y-0.5"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageModal;
