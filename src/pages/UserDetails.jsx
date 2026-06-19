import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    Spin,
    Alert,
    Row,
    Col,
    Typography,
    Empty,
    Modal,
    message,
} from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import api from '../config/url';
import {
    UserInfoCard,
    UserStatsCards,
    UserCharts,
    SubscriptionHistory,
    RecentSearches,
    UserTeams,
} from '../components/UserDetails';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const { Text } = Typography;

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/admin-dashboard/user/${id}`);
                setUserData(res.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError(err.response?.data?.message || 'Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserDetails();
    }, [id]);

    const handleActivate = () => {
        Modal.confirm({
            title: 'Activate subscription',
            content: 'Activate this user? A confirmation email will be sent automatically.',
            okText: 'Verify & activate',
            onOk: async () => {
                try {
                    setActivating(true);
                    const res = await api.post(`/auth/activate-subscription/${userData.user._id}`);
                    if (res.data.success) {
                        message.success('Subscription activated successfully');
                        window.location.reload();
                    }
                } catch (err) {
                    message.error('Failed to activate: ' + (err.response?.data?.message || err.message));
                } finally {
                    setActivating(false);
                }
            },
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 384 }}>
                <Spin size="large" tip="Loading user details…" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: 480, margin: '64px auto', textAlign: 'center' }}>
                <Alert type="error" message="Error" description={error} showIcon style={{ marginBottom: 16 }} />
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/user-management')}>
                    Back to user management
                </Button>
            </div>
        );
    }

    if (!userData) {
        return (
            <Empty description="No user data found" style={{ marginTop: 64 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/user-management')}>
                    Back to user management
                </Button>
            </Empty>
        );
    }

    const {
        user,
        stats,
        activeSubscription: realActiveSubscription,
        subscriptionHistory,
        recentSearches,
        teams,
        leadStats,
        chartData,
    } = userData;

    const activeSubscription =
        realActiveSubscription ||
        (user.planName
            ? {
                  package: { name: user.planName, features: [] },
                  amount: user.planAmount,
                  startDate: user.createdAt,
                  endDate: user.planExpiry,
                  status: user.status === 'active' ? 'Active' : 'Pending',
              }
            : null);

    const isUnderReview =
        user.status?.replace('_', ' ').toLowerCase() === 'under review' ||
        user.status?.toLowerCase() === 'under_review';

    const getScreenshotUrl = () => {
        const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '');
        const sPath = user.paymentScreenshot;
        return sPath.startsWith('http')
            ? sPath
            : `${baseUrl}${sPath.startsWith('/') ? '' : '/screenshots/'}${sPath}`;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <AdminPageHeader
                title="User details"
                subtitle="View detailed information and statistics"
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/user-management')}>
                        Back
                    </Button>
                }
            />

            <UserStatsCards stats={stats} />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <UserInfoCard user={user} />

                    {isUnderReview && (
                        <Card
                            bordered={false}
                            className="shadow-sm"
                            style={{ marginTop: 24, border: '1px solid #ffe58f', background: '#fffbe6' }}
                        >
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
                                <div>
                                    <Text strong>Action required</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Verify payment proof to activate access
                                    </Text>
                                </div>
                            </div>
                            <Button type="primary" block loading={activating} onClick={handleActivate}>
                                Verify & activate
                            </Button>
                        </Card>
                    )}

                    <Card title="Payment screenshot" bordered={false} className="shadow-sm" style={{ marginTop: 24 }}>
                        {user.paymentScreenshot ? (
                            <>
                                <div
                                    style={{
                                        aspectRatio: '3/4',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '1px solid #f0f0f0',
                                        background: '#fafafa',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => window.open(getScreenshotUrl(), '_blank')}
                                >
                                    <img
                                        src={getScreenshotUrl()}
                                        alt="Payment verification"
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12, textAlign: 'center' }}>
                                    Reference ID: {user.paymentScreenshot.split('-')[1] || 'N/A'}
                                </Text>
                                <Button block style={{ marginTop: 8 }} onClick={() => window.open(getScreenshotUrl(), '_blank')}>
                                    Open in new tab
                                </Button>
                            </>
                        ) : (
                            <Empty
                                image={<GlobalOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                                description="No screenshot uploaded"
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <SubscriptionHistory
                        subscriptions={subscriptionHistory}
                        activeSubscription={activeSubscription}
                    />

                    <div style={{ marginTop: 24 }}>
                        <UserTeams teams={teams} />
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <UserCharts chartData={chartData} leadStats={leadStats} type="spending" />
                    </div>
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <UserCharts chartData={chartData} leadStats={leadStats} type="other" />
            </div>

            <div style={{ marginTop: 24, marginBottom: 24 }}>
                <RecentSearches searches={recentSearches} />
            </div>
        </div>
    );
};

export default UserDetails;
