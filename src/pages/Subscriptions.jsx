import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { FaUserPlus, FaMoneyBillWave, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import StatsCard from '../components/StatsCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SubscriptionsTable from '../components/SubscriptionsTable';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [analytics, setAnalytics] = useState({ revenueTrend: [], statusDistribution: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [subsRes, analyticsRes] = await Promise.all([
                axios.get(`${BASE_URL}/subscriptions`),
                axios.get(`${BASE_URL}/subscriptions/analytics`)
            ]);

            setSubscriptions(subsRes.data.subscriptions);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate Stats
    const totalSubscribers = subscriptions.length;
    const totalRevenue = subscriptions.reduce((acc, sub) => acc + parseFloat(sub.amount.replace('$', '')), 0);
    const activePlans = subscriptions.filter(sub => sub.status === 'Active').length;

    // TODO: Advanced revenue calculation logic for "Monthly Revenue" vs "Total" vs "Avg". 
    // For now, using simple aggregations based on the fetched list.

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Subscriptions Analytics</h1>

            {/* Stats Cards - Dynamic Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Transactions"
                    value={totalSubscribers}
                    change="+12.5%"
                    icon={<FaUserPlus />}
                    color="bg-purple-100"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    change="+5.2%"
                    icon={<FaMoneyBillWave />}
                    color="bg-green-100"
                />
                <StatsCard
                    title="Avg. Revenue / User"
                    value={`$${totalSubscribers ? (totalRevenue / totalSubscribers).toFixed(2) : '0.00'}`}
                    change="-1.5%"
                    icon={<FaChartLine />}
                    color="bg-blue-100"
                />
                <StatsCard
                    title="Active Subscriptions"
                    value={activePlans}
                    change="0%"
                    icon={<FaBoxOpen />}
                    color="bg-orange-100"
                />
            </div>

            {/* Charts Section - Real Data */}
            <AnalyticsCharts
                revenueData={analytics.revenueTrend}
                distributionData={analytics.statusDistribution}
            />

            {/* Recent Subscriptions Table */}
            <SubscriptionsTable data={subscriptions} loading={loading} />
        </div>
    );
};

export default Subscriptions;