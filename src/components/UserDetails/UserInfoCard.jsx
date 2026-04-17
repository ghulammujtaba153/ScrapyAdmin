import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaVenusMars, FaBriefcase, FaWallet, FaRocket } from 'react-icons/fa';

const UserInfoCard = ({ user }) => {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                <div className="flex items-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="ml-5">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-blue-100">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                {user.role?.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                {user.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Highlights */}
            <div className="px-6 py-4 bg-blue-50 border-y border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md">
                        <FaRocket />
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Current Plan</p>
                        <h4 className="font-black text-gray-900">{user.planName || 'No Active Plan'}</h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Expiry Date</p>
                    <h4 className="font-black text-gray-900">
                        {user.planExpiry ? formatDate(user.planExpiry) : (user.planName ? 'Lifetime' : 'N/A')}
                    </h4>
                </div>
            </div>

            {/* Info Grid */}
            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Subscription Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem icon={<FaRocket />} label="Plan Name" value={user.planName || 'N/A'} />
                        <InfoItem icon={<FaWallet />} label="Amount Paid" value={user.planAmount || 'N/A'} />
                        <InfoItem icon={<FaCalendarAlt />} label="Expiry Date" value={user.planExpiry ? formatDate(user.planExpiry) : (user.planName ? 'Lifetime' : 'N/A')} />
                        <InfoItem icon={<FaCalendarAlt />} label="Member Since" value={formatDate(user.createdAt)} />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem icon={<FaEnvelope />} label="Email Address" value={user.email} />
                        <InfoItem icon={<FaGlobe />} label="Country" value={user.country || 'N/A'} />
                        <InfoItem icon={<FaBriefcase />} label="About User" value={user.aboutUser || 'N/A'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-blue-500 mt-1">{icon}</span>
        <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

export default UserInfoCard;
