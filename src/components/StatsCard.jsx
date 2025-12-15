import React from 'react';

const StatsCard = ({ title, value, change, icon, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <div className={`text-xs font-semibold mt-2 px-2 py-1 rounded inline-block ${change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change}
                </div>
            </div>
            <div className={`p-4 rounded-full bg-opacity-20 ${color}`}>
                <span className={`text-2xl ${color.replace('bg-', 'text-').replace('-100', '-600')}`}>
                    {icon}
                </span>
            </div>
        </div>
    );
};

export default StatsCard;
