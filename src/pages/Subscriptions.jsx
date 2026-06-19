import React, { useEffect, useState } from 'react';
import api from '../config/url';
import { Card, Col, Row, Spin, Statistic, Button } from 'antd';
import {
    DollarOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    LineChartOutlined,
    ReloadOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    MailOutlined,
} from '@ant-design/icons';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SubscriptionsTable from '../components/SubscriptionsTable';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const mapSubscriptionStatus = (sub) => {
    if (sub.planExpiry && new Date(sub.planExpiry) < new Date() && sub.status === 'active') {
        return 'Expired';
    }
    switch (sub.status) {
        case 'active':
            return 'Active';
        case 'under_review':
            return 'Pending';
        case 'blocked':
            return 'Blocked';
        case 'invited':
            return 'Invited';
        default:
            return sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1) || 'Unknown';
    }
};

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [analytics, setAnalytics] = useState({
        revenueTrend: [],
        statusDistribution: [],
        planDistribution: [],
        stats: {
            totalUsersWithPlan: 0,
            activeSubscriptions: 0,
            underReviewCount: 0,
            expiredCount: 0,
            pendingPaymentCount: 0,
            blockedCount: 0,
            invitedCount: 0,
            totalRevenue: 0,
        },
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subsRes, analyticsRes] = await Promise.all([
                api.get('/admin-dashboard/subscriptions/list'),
                api.get('/admin-dashboard/subscriptions/analytics'),
            ]);

            const mappedSubscriptions = subsRes.data.subscriptions.map((sub) => ({
                id: sub._id,
                user: sub.name || sub.email,
                plan: sub.planName || 'N/A',
                planId: sub.planId || '—',
                date: new Date(sub.createdAt).toLocaleDateString(),
                amount: sub.planAmount || '$0.00',
                status: mapSubscriptionStatus(sub),
                rawStatus: sub.status,
                email: sub.email,
                expiry: sub.planExpiry ? new Date(sub.planExpiry).toLocaleDateString() : 'Lifetime',
                screenshot: sub.paymentScreenshot,
                userType: sub.userType === 'INTL' ? 'International' : 'Local',
            }));

            setSubscriptions(mappedSubscriptions);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error('Error fetching subscription data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { stats } = analytics;
    const avgTicket = stats.totalUsersWithPlan
        ? (stats.totalRevenue / stats.totalUsersWithPlan).toFixed(2)
        : '0.00';

    const statCards = [
        {
            title: 'Total revenue',
            value: stats.totalRevenue,
            icon: <DollarOutlined style={{ color: '#0F792C' }} />,
            precision: 2,
        },
        {
            title: 'Active plans',
            value: stats.activeSubscriptions,
            icon: <TeamOutlined style={{ color: '#1677ff' }} />,
        },
        {
            title: 'Total subscribers',
            value: stats.totalUsersWithPlan,
            icon: <UserOutlined style={{ color: '#722ed1' }} />,
        },
        {
            title: 'Under review',
            value: stats.underReviewCount,
            icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
        },
        {
            title: 'Pending payment',
            value: stats.pendingPaymentCount,
            icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
        },
        {
            title: 'Expired plans',
            value: stats.expiredCount,
            icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
        },
        {
            title: 'Invited',
            value: stats.invitedCount,
            icon: <MailOutlined style={{ color: '#13c2c2' }} />,
        },
        {
            title: 'Avg. ticket size',
            value: avgTicket,
            icon: <LineChartOutlined style={{ color: '#722ed1' }} />,
            formatter: (v) => `$${v}`,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AdminPageHeader
                title="Subscription analytics"
                subtitle="Stats from user profile fields — planName, planAmount, planExpiry, status, and payment proof"
                extra={
                    <Button icon={<ReloadOutlined spin={loading} />} onClick={fetchData} loading={loading}>
                        Refresh
                    </Button>
                }
            />

            <Spin spinning={loading}>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {statCards.map((card) => (
                        <Col xs={24} sm={12} lg={6} key={card.title}>
                            <Card bordered={false} className="shadow-sm">
                                <Statistic
                                    title={card.title}
                                    value={card.value}
                                    prefix={card.icon}
                                    precision={card.precision}
                                    formatter={card.formatter}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div style={{ marginBottom: 24 }}>
                    <AnalyticsCharts
                        revenueData={analytics.revenueTrend}
                        distributionData={analytics.statusDistribution}
                        planDistribution={analytics.planDistribution}
                    />
                </div>

                <Card title="All subscribers" bordered={false} className="shadow-sm">
                    <SubscriptionsTable data={subscriptions} loading={loading} />
                </Card>
            </Spin>
        </div>
    );
};

export default Subscriptions;
