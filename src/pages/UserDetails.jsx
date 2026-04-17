import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaClock } from 'react-icons/fa';
import api from '../config/url';
import {
    UserInfoCard,
    UserStatsCards,
    UserCharts,
    SubscriptionHistory,
    RecentSearches
} from '../components/UserDetails';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/admin-dashboard/user/${id}`);
                setUserData(res.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError(error.response?.data?.message || "Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/user-management')}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
                    >
                        <FaArrowLeft className="mr-2" /> Back to User Management
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-600">No user data found</p>
            </div>
        );
    }

    const { user, stats, activeSubscription: realActiveSubscription, subscriptionHistory, recentSearches, chartData } = userData;

    // Use existing active subscription or derive one from user plan data for manual registrations
    const activeSubscription = realActiveSubscription || (user.planName ? {
        package: { name: user.planName, features: [] },
        amount: user.planAmount,
        startDate: user.createdAt,
        endDate: user.planExpiry,
        status: user.status === 'active' ? 'Active' : 'Pending'
    } : null);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/user-management')}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
                        <p className="text-gray-500 text-sm">View detailed information and statistics</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <UserStatsCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* User Info Card - Takes 1 column */}
                <div className="lg:col-span-1 space-y-6">
                    <UserInfoCard user={user} />

                    {(user.status?.replace('_', ' ').toLowerCase() === 'under review' || user.status?.toLowerCase() === 'under_review') ? (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                    <FaClock className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-sm">Action Required</h3>
                                    <p className="text-[10px] text-gray-600 font-medium">Verify payment proof to activate access</p>
                                </div>
                            </div>
                            <button 
                                onClick={async () => {
                                    if (window.confirm("Activate this user? A confirmation email will be sent automatically.")) {
                                        try {
                                            const res = await api.post(`/auth/activate-subscription/${user._id}`);
                                            if (res.data.success) {
                                                alert("Subscription activated successfully!");
                                                window.location.reload(); 
                                            }
                                        } catch (err) {
                                            alert("Failed to activate: " + (err.response?.data?.message || err.message));
                                        }
                                    }
                                }}
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-none hover:translate-y-0.5 transition-all"
                            >
                                Verify & Activate
                            </button>
                        </div>
                    ) : null}
                    
                    {/* Payment Screenshot Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Payment Screenshot</h3>
                        </div>
                        <div className="p-5 flex flex-col items-center">
                            {user.paymentScreenshot ? (
                                <>
                                    <div className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
                                        {(() => {
                                            const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
                                            const sPath = user.paymentScreenshot;
                                            const fullUrl = sPath.startsWith('http') 
                                                ? sPath 
                                                : `${baseUrl}${sPath.startsWith('/') ? '' : '/screenshots/'}${sPath}`;
                                            
                                            return (
                                                <img 
                                                    src={fullUrl} 
                                                    alt="Payment Verification" 
                                                    crossOrigin="anonymous"
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                                                    onClick={() => window.open(fullUrl, '_blank')}
                                                    onError={(e) => {
                                                        console.error("Image failed to load:", fullUrl);
                                                        // Fallback text or icon could go here if needed
                                                    }}
                                                />
                                            );
                                        })()}
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
                                                    const sPath = user.paymentScreenshot;
                                                    const fullUrl = sPath.startsWith('http') ? sPath : `${baseUrl}${sPath.startsWith('/') ? '' : '/screenshots/'}${sPath}`;
                                                    window.open(fullUrl, '_blank');
                                                }}
                                                className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl"
                                            >
                                                Open in New Tab
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3 text-center">Reference ID: {user.paymentScreenshot.split('-')[1] || 'N/A'}</p>
                                </>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        {/* Use a static icon instead of spinner if no image */}
                                        <FaGlobe className="text-2xl opacity-20" />
                                    </div>
                                    <p className="text-sm">No screenshot uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscription & Searches - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <SubscriptionHistory
                        subscriptions={subscriptionHistory}
                        activeSubscription={activeSubscription}
                    />
                </div>
            </div>

            {/* Charts Section */}
            <UserCharts chartData={chartData} />

            {/* Recent Searches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentSearches searches={recentSearches} />
            </div>
        </div>
    );
};

export default UserDetails;
