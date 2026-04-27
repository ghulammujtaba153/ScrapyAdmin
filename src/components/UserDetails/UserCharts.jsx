import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#6B7280', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                <p className="text-gray-600 font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const UserCharts = ({ chartData, leadStats, type = 'all' }) => {
    if (!chartData) return null;

    const { spending = [], searchActivity = [], subscriptionDistribution = [] } = chartData;

    const leadDistribution = leadStats ? [
        { name: 'Interested', value: leadStats.interested, color: '#10B981' },
        { name: 'Not Interested', value: leadStats.notInterested, color: '#EF4444' },
        { name: 'No Response', value: leadStats.noResponse, color: '#F59E0B' },
        { name: 'Not Reached', value: leadStats.notReached, color: '#6B7280' }
    ].filter(item => item.value > 0) : [];

    return (
        <div className={`grid grid-cols-1 ${(type === 'all' || type === 'other') ? 'lg:grid-cols-2' : ''} gap-6 mb-6`}>
            {/* Spending Chart */}
            {(type === 'all' || type === 'spending') && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Spending</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spending} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="amount" 
                                name="Spending"
                                stroke="#10B981" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorSpending)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            )}

            {/* Search Activity Chart */}
            {(type === 'all' || type === 'other') && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Search Activity</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={searchActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="searches" name="Searches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="records" name="Records" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            )}

            
            

            {/* Lead Status Distribution */}
            {(type === 'all' || type === 'other') && leadDistribution.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Lead Contact Status</h3>
                        <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                            WhatsApp Verified: {leadStats.whatsappVerified}
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leadDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {leadDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCharts;
