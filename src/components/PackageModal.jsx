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
        features: []
    });
    const [newFeature, setNewFeature] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pkg) {
            setFormData({
                name: pkg.name || '',
                description: pkg.description || '',
                price: pkg.price || '',
                interval: pkg.interval || 'month',
                stripePriceId: pkg.stripePriceId || '',
                features: pkg.features || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                interval: 'month',
                stripePriceId: '',
                features: []
            });
        }
        setNewFeature('');
    }, [pkg, isOpen]);

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature();
        }
    };

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
                features: formData.features
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
                                
                                {/* Feature input with add button */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyDown={handleFeatureKeyDown}
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Enter a feature..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Features list */}
                                {formData.features.length > 0 && (
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {formData.features.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors"
                                            >
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {formData.features.length === 0 && (
                                    <p className="text-xs text-gray-400 italic">No features added yet</p>
                                )}
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
