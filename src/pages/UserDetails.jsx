import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
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

    const { user, stats, activeSubscription, subscriptionHistory, recentSearches, chartData } = userData;

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
                    
                    {/* Payment Screenshot Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Payment Screenshot</h3>
                        </div>
                        <div className="p-5 flex flex-col items-center">
                            {user.paymentScreenshot ? (
                                <>
                                    <div className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                        <img 
                                            src={`${import.meta.env.VITE_BASE_URL}/screenshots/${user.paymentScreenshot}`} 
                                            alt="Payment Verification" 
                                            className="w-full h-full object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300"
                                            onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/screenshots/${user.paymentScreenshot}`, '_blank')}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3 text-center">Click image to view full size</p>
                                </>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FaSpinner className="text-2xl opacity-20" />
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
