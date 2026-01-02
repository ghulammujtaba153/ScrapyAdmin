import React from 'react';
import { FaDollarSign, FaSearch, FaDatabase, FaCreditCard, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const UserStatsCards = ({ stats }) => {
    if (!stats) return null;

    const statsData = [
        {
            title: 'Total Spent',
            value: `$${stats.totalSpent?.toLocaleString() || 0}`,
            icon: <FaDollarSign />,
            color: 'bg-green-100',
            iconColor: 'text-green-600',
            description: 'Lifetime spending'
        },
        {
            title: 'Total Subscriptions',
            value: stats.totalSubscriptions || 0,
            icon: <FaCreditCard />,
            color: 'bg-blue-100',
            iconColor: 'text-blue-600',
            description: 'All time'
        },
        {
            title: 'Total Searches',
            value: stats.totalSearches || 0,
            icon: <FaSearch />,
            color: 'bg-purple-100',
            iconColor: 'text-purple-600',
            description: `${stats.searchesThisMonth || 0} this month`
        },
        {
            title: 'Records Scraped',
            value: stats.totalRecords?.toLocaleString() || 0,
            icon: <FaDatabase />,
            color: 'bg-orange-100',
            iconColor: 'text-orange-600',
            description: 'Total data collected'
        },
        {
            title: 'Active Subscription',
            value: stats.hasActiveSubscription ? 'Yes' : 'No',
            icon: <FaCheckCircle />,
            color: stats.hasActiveSubscription ? 'bg-emerald-100' : 'bg-red-100',
            iconColor: stats.hasActiveSubscription ? 'text-emerald-600' : 'text-red-600',
            description: stats.hasActiveSubscription ? 'Currently active' : 'No active plan'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statsData.map((stat, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                            <span className={`text-xl ${stat.iconColor}`}>{stat.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserStatsCards;
