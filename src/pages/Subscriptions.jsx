import React, { useEffect, useState } from 'react';
import api from '../config/url';
import { FaUserPlus, FaMoneyBillWave, FaChartLine, FaBoxOpen, FaClock, FaSyncAlt } from 'react-icons/fa';
import StatsCard from '../components/StatsCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SubscriptionsTable from '../components/SubscriptionsTable';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [analytics, setAnalytics] = useState({ 
        revenueTrend: [], 
        statusDistribution: [],
        stats: {
            totalUsersWithPlan: 0,
            activeSubscriptions: 0,
            underReviewCount: 0,
            totalRevenue: 0
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subsRes, analyticsRes] = await Promise.all([
                api.get('/admin-dashboard/subscriptions/list'),
                api.get('/admin-dashboard/subscriptions/analytics')
            ]);

            // Map data to table format
            const mappedSubscriptions = subsRes.data.subscriptions.map(sub => ({
                id: sub._id,
                user: sub.name || sub.email,
                plan: sub.planName || 'N/A',
                date: new Date(sub.createdAt).toLocaleDateString(),
                amount: sub.planAmount || '$0.00',
                status: sub.status === 'active' ? 'Active' : sub.status === 'under_review' ? 'Pending' : sub.status.charAt(0).toUpperCase() + sub.status.slice(1),
                email: sub.email,
                expiry: sub.planExpiry ? new Date(sub.planExpiry).toLocaleDateString() : 'Lifetime',
                screenshot: sub.paymentScreenshot
            }));

            setSubscriptions(mappedSubscriptions);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error fetching subscription data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { stats } = analytics;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Subscription Analytics</h1>
                        <p className="text-gray-500 mt-1">Real-time overview of revenue, plans, and pending approvals.</p>
                    </div>
                    <button 
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-semibold active:scale-95 disabled:opacity-50"
                    >
                        <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                        Refresh Analytics
                    </button>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        change="+5.2%"
                        icon={<FaMoneyBillWave />}
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Active Subscriptions"
                        value={stats.activeSubscriptions}
                        change="+12%"
                        icon={<FaBoxOpen />}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Under Review"
                        value={stats.underReviewCount}
                        change="Pending Approval"
                        icon={<FaClock />}
                        color="bg-amber-500"
                    />
                    <StatsCard
                        title="Avg. Ticket Size"
                        value={`$${stats.totalUsersWithPlan ? (stats.totalRevenue / stats.totalUsersWithPlan).toFixed(2) : '0.00'}`}
                        change="Overall"
                        icon={<FaChartLine />}
                        color="bg-purple-500"
                    />
                </div>

                {/* Analytics & Charts */}
                <div className="mb-10">
                    <AnalyticsCharts
                        revenueData={analytics.revenueTrend}
                        distributionData={analytics.statusDistribution}
                    />
                </div>

                {/* Main Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Recent Subscription Activity</h2>
                    </div>
                    <SubscriptionsTable data={subscriptions} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;