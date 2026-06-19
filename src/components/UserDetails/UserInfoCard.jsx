import React from 'react';
import { Card, Avatar, Tag, Typography, Descriptions, Divider } from 'antd';
import {
    MailOutlined,
    GlobalOutlined,
    CalendarOutlined,
    RocketOutlined,
    WalletOutlined,
    IdcardOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserInfoCard = ({ user }) => {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const statusColor =
        user.status?.toLowerCase() === 'active'
            ? 'success'
            : user.status?.toLowerCase() === 'blocked'
              ? 'error'
              : 'warning';

    return (
        <Card bordered={false} className="shadow-sm" styles={{ body: { padding: 0 } }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, #0F792C 0%, #34d399 100%)',
                    padding: '24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={72} style={{ backgroundColor: '#fff', color: '#0F792C', fontSize: 28, fontWeight: 700 }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <div>
                        <Title level={4} style={{ color: '#fff', margin: 0 }}>
                            {user.name}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)' }}>{user.email}</Text>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Tag color="purple">{user.role?.toUpperCase()}</Tag>
                            <Tag color={statusColor}>{user.status?.replace('_', ' ').toUpperCase()}</Tag>
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    padding: '16px 24px',
                    background: '#f6ffed',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <RocketOutlined style={{ fontSize: 20, color: '#0F792C' }} />
                    <div>
                        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase' }}>
                            Current plan
                        </Text>
                        <br />
                        <Text strong>{user.planName || 'No active plan'}</Text>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase' }}>
                        Expiry
                    </Text>
                    <br />
                    <Text strong>
                        {user.planExpiry ? formatDate(user.planExpiry) : user.planName ? 'Lifetime' : 'N/A'}
                    </Text>
                </div>
            </div>

            <div style={{ padding: 24 }}>
                <Divider orientation="left" plain>
                    Subscription details
                </Divider>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label={<><RocketOutlined /> Plan</>}>
                        {user.planName || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><WalletOutlined /> Amount paid</>}>
                        {user.planAmount || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><CalendarOutlined /> Expiry</>}>
                        {user.planExpiry ? formatDate(user.planExpiry) : user.planName ? 'Lifetime' : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><CalendarOutlined /> Member since</>}>
                        {formatDate(user.createdAt)}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left" plain>
                    Personal information
                </Divider>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label={<><MailOutlined /> Email</>}>{user.email}</Descriptions.Item>
                    <Descriptions.Item label={<><GlobalOutlined /> Country</>}>
                        {user.country || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><IdcardOutlined /> About</>}>
                        {user.aboutUser || 'N/A'}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Card>
    );
};

export default UserInfoCard;
