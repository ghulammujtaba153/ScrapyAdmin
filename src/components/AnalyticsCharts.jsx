import React from 'react';
import {
    LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Row, Col, Card } from 'antd';

const COLORS = ['#0F792C', '#1677ff', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];

const AnalyticsCharts = ({ revenueData = [], distributionData = [], planDistribution = [] }) => (
    <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
            <Card title="Revenue trends" bordered={false} className="shadow-sm">
                <div style={{ height: 320, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0F792C" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0F792C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#0F792C" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>

        <Col xs={24} lg={12}>
            <Card title="Status distribution" bordered={false} className="shadow-sm">
                <div style={{ height: 320, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`status-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>

        {planDistribution.length > 0 && (
            <Col xs={24}>
                <Card title="Plan distribution (by planName)" bordered={false} className="shadow-sm">
                    <div style={{ height: 320, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {planDistribution.map((entry, index) => (
                                        <Cell key={`plan-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Col>
        )}
    </Row>
);

export default AnalyticsCharts;
