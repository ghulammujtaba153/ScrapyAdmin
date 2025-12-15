import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/url';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        country: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                country: user.country || '',
                phone: user.phone || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'user',
                country: '',
                phone: ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (user) {
                // Update existing user
                res = await axios.put(`${BASE_URL}/auth/updateUser/${user._id}`, formData);
                alert("User updated successfully");
                onSave(res.data.user);
            } else {
                // Invite new user
                res = await axios.post(`${BASE_URL}/auth/invite-user`, formData);
                alert("Invitation sent successfully");
                onSave(res.data.user);
            }
            onClose();
        } catch (error) {
            console.error("Error saving user", error);
            alert(error.response?.data?.message || "Failed to save user");
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
                            {user ? 'Edit User Profile' : 'Invite New User'}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                                    <input
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="USA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

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
                                    {loading ? 'Processing...' : (user ? 'Update User' : 'Send Invitation')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
