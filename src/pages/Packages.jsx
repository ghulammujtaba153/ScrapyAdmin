import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import PackageModal from '../components/PackageModal';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);

    const fetchPackages = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/packages`);
            setPackages(res.data.packages);
        } catch (error) {
            console.error("Error fetching packages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleAdd = () => {
        setCurrentPackage(null);
        setIsModalOpen(true);
    };

    const handleEdit = (pkg) => {
        setCurrentPackage(pkg);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                await axios.delete(`${BASE_URL}/packages/${id}`);
                setPackages(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Error deleting package", error);
                alert("Failed to delete package");
            }
        }
    };

    const handleSave = (savedPackage) => {
        if (currentPackage) {
            setPackages(prev => prev.map(p => p._id === savedPackage._id ? savedPackage : p));
        } else {
            setPackages(prev => [savedPackage, ...prev]);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Subscription Packages</h1>
                    <p className="text-gray-500 mt-1">Manage your pricing tiers and features</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                >
                    <FaPlus className="mr-2" /> Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                        Loading packages...
                    </div>
                ) : packages.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No packages found. Create your first packet to get started.</p>
                    </div>
                ) : packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 relative group">

                        {/* Header Gradient */}
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                        <div className="p-8 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">{pkg.name}</h3>
                                {pkg.interval && (
                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                                        {pkg.interval}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">${pkg.price}</span>
                                <span className="text-gray-500 ml-1">/{pkg.interval === 'one-time' ? 'once' : pkg.interval}</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 leading-relaxed border-b border-gray-100 pb-6">
                                {pkg.description || "No description provided."}
                            </p>

                            <ul className="space-y-4">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-gray-700 text-sm">
                                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" size={14} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions Overlay / Footer */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end space-x-3">
                            <button
                                onClick={() => handleEdit(pkg)}
                                className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
                            >
                                <FaEdit className="mr-2" size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(pkg._id)}
                                className="flex items-center text-gray-600 hover:text-red-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-red-50"
                            >
                                <FaTrash className="mr-2" size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <PackageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pkg={currentPackage}
                onSave={handleSave}
            />
        </div>
    );
};

export default Packages;