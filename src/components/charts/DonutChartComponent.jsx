import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
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
            </div>
        );
    }
    return null;
};

const DonutChartComponent = ({ 
    data = [], 
    title = "Donut Chart",
    centerLabel = "",
    centerValue = "",
    dataKey = 'value',
    nameKey = 'name',
    colors = COLORS,
    height = 300
}) => {
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div style={{ height: height }} className="w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800">
                        {centerValue || total.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">{centerLabel || 'Total'}</span>
                </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-gray-600">{entry[nameKey]}</span>
                        <span className="text-sm font-medium text-gray-800">
                            ({((entry[dataKey] / total) * 100).toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChartComponent;
