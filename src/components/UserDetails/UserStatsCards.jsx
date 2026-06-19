import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
    DollarOutlined,
    CreditCardOutlined,
    SearchOutlined,
    DatabaseOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';

const UserStatsCards = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        {
            title: 'Total spent',
            value: stats.totalSpent || 0,
            prefix: <DollarOutlined style={{ color: '#0F792C' }} />,
            precision: 2,
            suffix: undefined,
            formatter: (v) => `$${Number(v).toLocaleString()}`,
            description: 'Lifetime spending',
        },
        {
            title: 'Total subscriptions',
            value: stats.totalSubscriptions || 0,
            prefix: <CreditCardOutlined style={{ color: '#1677ff' }} />,
            description: 'All time',
        },
        {
            title: 'Total searches',
            value: stats.totalSearches || 0,
            prefix: <SearchOutlined style={{ color: '#722ed1' }} />,
            description: `${stats.searchesThisMonth || 0} this month`,
        },
        {
            title: 'Records scraped',
            value: stats.totalRecords || 0,
            prefix: <DatabaseOutlined style={{ color: '#fa8c16' }} />,
            formatter: (v) => Number(v).toLocaleString(),
            description: 'Total data collected',
        },
        {
            title: 'Active subscription',
            value: stats.hasActiveSubscription ? 1 : 0,
            prefix: (
                <CheckCircleOutlined
                    style={{ color: stats.hasActiveSubscription ? '#52c41a' : '#ff4d4f' }}
                />
            ),
            formatter: () => (stats.hasActiveSubscription ? 'Yes' : 'No'),
            description: stats.hasActiveSubscription ? 'Currently active' : 'No active plan',
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {cards.map((stat) => (
                <Col xs={24} sm={12} lg={8} xl={24 / 5} key={stat.title}>
                    <Card bordered={false} className="shadow-sm" size="small">
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            prefix={stat.prefix}
                            precision={stat.precision}
                            formatter={stat.formatter}
                        />
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>{stat.description}</div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default UserStatsCards;
