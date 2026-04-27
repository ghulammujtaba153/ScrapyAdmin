import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/userAuth";
import api from "../config/url";
import { 
    FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSave, 
    FaGlobe, FaInfoCircle, FaGem, FaCalendarAlt, FaDollarSign, FaTag
} from "react-icons/fa";

const Profile = () => {
    const { user, updateUserData } = useUserAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileData, setProfileData] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        aboutUser: '',
        password: '',
        confirmPassword: ''
    });

    // Fetch user profile (lightweight endpoint only)
    const fetchUserProfile = async () => {
        if (!user?._id) return;
        try {
            setProfileLoading(true);
            const res = await api.get(`/auth/profile/${user._id}`);
            const profile = res.data.user;
            setProfileData(profile);

            setFormData(prev => ({
                ...prev,
                name: profile.name || '',
                email: profile.email || '',
                country: profile.country || '',
                aboutUser: profile.aboutUser || ''
            }));
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user?._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                country: formData.country,
                aboutUser: formData.aboutUser
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await api.put(`/auth/update/${user._id}`, updateData);
            
            if (res.status === 200) {
                // Update auth context so sidebar/navbar reflect changes immediately
                updateUserData({
                    name: formData.name,
                    email: formData.email,
                    country: formData.country,
                    aboutUser: formData.aboutUser
                });
                
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            }
        } catch (error) {
            console.error("Update error:", error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile' 
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your admin profile and security settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card & Plan Info */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-primary to-emerald-500"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-16 mb-4">
                                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-primary text-4xl font-black shadow-xl border-4 border-white">
                                        {formData.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Admin'}</h2>
                                <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                        {user?.role || 'User'}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {user?.status?.replace('_', ' ') || 'Pending'}
                                    </span>
                                    {(profileData?.userType || user?.userType) && (
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {(profileData?.userType || user?.userType) === 'INTL' ? 'International' : 'Local'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Feedback Message */}
                                {message.text && (
                                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                        message.type === 'success' 
                                            ? 'bg-green-50 text-green-700 border border-green-100' 
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        <FaInfoCircle />
                                        <span className="font-medium">{message.text}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                <FaUser />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                <FaEnvelope />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Country Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Country</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                <FaGlobe />
                                            </div>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium"
                                                placeholder="United States"
                                            />
                                        </div>
                                    </div>

                                    {/* About Field */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Bio / About</label>
                                        <div className="relative group">
                                            <div className="absolute top-4 left-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                <FaInfoCircle />
                                            </div>
                                            <textarea
                                                name="aboutUser"
                                                value={formData.aboutUser}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium resize-none"
                                                placeholder="Tell us a bit about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2 mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Security</h3>
                                        <span className="text-xs text-gray-400 font-medium">(Leave blank to keep current)</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                    <FaLock />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                                    <FaLock />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-800 font-medium"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                                Updating Profile...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;