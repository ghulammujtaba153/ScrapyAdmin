import React from 'react';
import { FaCheckCircle, FaClock, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const SubscriptionHistory = ({ subscriptions = [], activeSubscription }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active':
                return <FaCheckCircle className="text-green-500" />;
            case 'Pending':
                return <FaClock className="text-yellow-500" />;
            case 'Cancelled':
                return <FaTimes className="text-red-500" />;
            case 'Expired':
                return <FaExclamationCircle className="text-gray-500" />;
            default:
                return <FaCheckCircle className="text-blue-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Expired':
                return 'bg-gray-100 text-gray-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Active Subscription Card */}
            {activeSubscription && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Current Active Plan</h3>
                            <p className="text-3xl font-bold">{activeSubscription.package?.name || 'N/A'}</p>
                            <p className="text-blue-100 mt-2">
                                ${activeSubscription.amount?.toLocaleString()} / {activeSubscription.package?.interval || 'N/A'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-sm">Started</p>
                            <p className="font-semibold">{formatDate(activeSubscription.startDate)}</p>
                            {activeSubscription.endDate && (
                                <>
                                    <p className="text-blue-100 text-sm mt-2">Expires</p>
                                    <p className="font-semibold">{formatDate(activeSubscription.endDate)}</p>
                                </>
                            )}
                        </div>
                    </div>
                    {activeSubscription.package?.features?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-blue-400">
                            <p className="text-sm text-blue-100 mb-2">Features:</p>
                            <div className="flex flex-wrap gap-2">
                                {activeSubscription.package.features.map((feature, idx) => (
                                    <span key={idx} className="bg-blue-400 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Subscription History Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Subscription History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Package
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No subscription history found
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(sub.status)}
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {sub.package?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            ${sub.amount?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(sub.startDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(sub.endDate)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHistory;
