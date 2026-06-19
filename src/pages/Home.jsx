import React, { useState, useEffect } from 'react';
import api from '../config/url';
import {
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    AreaChartComponent,
    DonutChartComponent,
    ChartFilter,
} from '../components/charts';
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import {
    UserOutlined,
    DollarOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    DatabaseOutlined,
    ExclamationCircleOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const { Text } = Typography;

const statCards = [
    { key: 'totalUsers', title: 'Total users', icon: <UserOutlined />, growthKey: 'userGrowthPercent', color: '#0F792C' },
    {
        key: 'totalRevenue',
        title: 'Plan revenue',
        icon: <DollarOutlined />,
        growthKey: 'revenueGrowthPercent',
        prefix: '$',
        precision: 2,
        color: '#0F792C',
    },
    {
        key: 'activeSubscriptions',
        title: 'Active plans',
        icon: <TeamOutlined />,
        growthKey: 'subscriptionGrowthPercent',
        color: '#1677ff',
    },
    {
        key: 'totalSubscribers',
        title: 'Total subscribers',
        icon: <CreditCardOutlined />,
        color: '#722ed1',
    },
    {
        key: 'underReviewCount',
        title: 'Under review',
        icon: <ClockCircleOutlined />,
        color: '#faad14',
    },
    {
        key: 'pendingPaymentCount',
        title: 'Pending payment',
        icon: <ExclamationCircleOutlined />,
        color: '#fa8c16',
    },
    {
        key: 'totalSearches',
        title: 'Total searches',
        icon: <SearchOutlined />,
        growthKey: 'searchGrowthPercent',
        color: '#13c2c2',
    },
    {
        key: 'totalRecords',
        title: 'Records scraped',
        icon: <DatabaseOutlined />,
        growthKey: 'recordGrowthPercent',
        color: '#eb2f96',
    },
];

const Home = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        userGrowthPercent: 0,
        totalRevenue: 0,
        revenueGrowthPercent: 0,
        activeSubscriptions: 0,
        subscriptionGrowthPercent: 0,
        totalSubscribers: 0,
        underReviewCount: 0,
        expiredCount: 0,
        pendingPaymentCount: 0,
        totalSearches: 0,
        searchGrowthPercent: 0,
        totalRecords: 0,
        recordGrowthPercent: 0,
    });
    const [chartData, setChartData] = useState({
        userGrowth: [],
        revenue: [],
        activity: [],
        subscriptions: [],
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/admin-dashboard?period=${timeFilter}`);
                setStats(res.data.stats);
                setChartData(res.data.chartData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [timeFilter]);

    return (
        <div className="max-w-[1600px] mx-auto">
            <AdminPageHeader
                title="Dashboard overview"
                subtitle="Metrics from user profiles — planName, planAmount, planExpiry, and status"
                extra={<ChartFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />}
            />

            <Spin spinning={loading} tip="Loading dashboard…">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {statCards.map((card) => {
                        const value = stats[card.key] ?? 0;
                        const growth = card.growthKey ? stats[card.growthKey] : null;

                        return (
                            <Col xs={24} sm={12} lg={8} xl={6} key={card.key}>
                                <Card bordered={false} className="shadow-sm h-full">
                                    <Statistic
                                        title={
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: card.color }}>{card.icon}</span>
                                                {card.title}
                                            </span>
                                        }
                                        value={value}
                                        prefix={card.prefix}
                                        precision={card.precision}
                                        suffix={
                                            growth !== null ? (
                                                <Text
                                                    type={growth >= 0 ? 'success' : 'danger'}
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {growth >= 0 ? '+' : ''}
                                                    {growth}%
                                                </Text>
                                            ) : null
                                        }
                                    />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={12}>
                        <Card title="Revenue overview" bordered={false} className="shadow-sm">
                            <AreaChartComponent
                                data={chartData.revenue}
                                title=""
                                areas={[{ dataKey: 'revenue', color: '#0F792C', name: 'Revenue' }]}
                                height={320}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="User growth" bordered={false} className="shadow-sm">
                            <LineChartComponent
                                data={chartData.userGrowth}
                                title=""
                                lines={[
                                    { dataKey: 'users', color: '#3B82F6', name: 'Total Users' },
                                    { dataKey: 'newUsers', color: '#8B5CF6', name: 'New Users' },
                                ]}
                                height={320}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={12}>
                        <Card title="Plan distribution (active)" bordered={false} className="shadow-sm">
                            <DonutChartComponent
                                data={chartData.subscriptions}
                                title=""
                                centerLabel="Plans"
                                height={320}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Plan breakdown" bordered={false} className="shadow-sm">
                            <PieChartComponent
                                data={chartData.subscriptions}
                                title=""
                                height={320}
                                innerRadius={0}
                                outerRadius={90}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Scraping activity" bordered={false} className="shadow-sm" style={{ marginBottom: 24 }}>
                    <BarChartComponent
                        data={chartData.activity}
                        title=""
                        bars={[
                            { dataKey: 'searches', color: '#8B5CF6', name: 'Searches' },
                            { dataKey: 'records', color: '#0F792C', name: 'Records' },
                        ]}
                        height={350}
                    />
                </Card>

                <Card title="Monthly revenue" bordered={false} className="shadow-sm">
                    <BarChartComponent
                        data={chartData.revenue}
                        title=""
                        bars={[{ dataKey: 'revenue', color: '#0F792C', name: 'Revenue' }]}
                        height={350}
                    />
                </Card>
            </Spin>
        </div>
    );
};

export default Home;
