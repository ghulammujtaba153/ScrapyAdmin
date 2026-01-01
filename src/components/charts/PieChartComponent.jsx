import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                <p className="text-gray-800 font-medium">{payload[0].name}</p>
                <p className="text-gray-600 text-sm">
                    Value: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
                </p>
                <p className="text-gray-500 text-xs">
                    {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

const PieChartComponent = ({ 
    data = [], 
    title = "Pie Chart",
    dataKey = 'value',
    nameKey = 'name',
    colors = COLORS,
    height = 300,
    innerRadius = 60,
    outerRadius = 100
}) => {
    // Calculate total for percentage
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);
    const dataWithTotal = data.map(item => ({ ...item, total }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div style={{ height: height }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataWithTotal}
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {dataWithTotal.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={colors[index % colors.length]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChartComponent;
