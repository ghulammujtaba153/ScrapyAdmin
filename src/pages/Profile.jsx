import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/userAuth';
import api from '../config/url';
import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Avatar,
    Tag,
    Alert,
    Typography,
    Divider,
    Spin,
} from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Profile = () => {
    const { user, updateUserData } = useUserAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [profileData, setProfileData] = useState(null);

    const fetchUserProfile = async () => {
        if (!user?._id) return;
        try {
            setProfileLoading(true);
            const res = await api.get(`/auth/profile/${user._id}`);
            const profile = res.data.user;
            setProfileData(profile);
            form.setFieldsValue({
                name: profile.name || '',
                email: profile.email || '',
                country: profile.country || '',
                aboutUser: profile.aboutUser || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user?._id]);

    const handleSubmit = async (values) => {
        if (values.password && values.password !== values.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (values.password && values.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const updateData = {
                name: values.name,
                email: values.email,
                country: values.country,
                aboutUser: values.aboutUser,
            };
            if (values.password) updateData.password = values.password;

            const res = await api.put(`/auth/update/${user._id}`, updateData);
            if (res.status === 200) {
                updateUserData({
                    name: values.name,
                    email: values.email,
                    country: values.country,
                    aboutUser: values.aboutUser,
                });
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                form.setFieldsValue({ password: '', confirmPassword: '' });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile',
            });
        } finally {
            setLoading(false);
        }
    };

    const displayName = Form.useWatch('name', form) || user?.name || 'Admin';

    return (
        <div className="max-w-6xl mx-auto">
            <AdminPageHeader
                title="Account settings"
                subtitle="Manage your admin profile and security settings"
            />

            <Spin spinning={profileLoading}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Card bordered={false} className="shadow-sm text-center">
                            <div
                                style={{
                                    height: 80,
                                    background: 'linear-gradient(90deg, #0F792C, #34d399)',
                                    margin: '-24px -24px 0',
                                    borderRadius: '8px 8px 0 0',
                                }}
                            />
                            <Avatar
                                size={80}
                                style={{
                                    backgroundColor: '#0F792C',
                                    marginTop: -40,
                                    fontSize: 28,
                                    fontWeight: 700,
                                }}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                                {displayName}
                            </Title>
                            <Text type="secondary">{user?.email}</Text>
                            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                                <Tag color="green">{user?.role || 'User'}</Tag>
                                <Tag color={user?.status === 'active' ? 'success' : 'warning'}>
                                    {(user?.status || 'pending').replace('_', ' ')}
                                </Tag>
                                {(profileData?.userType || user?.userType) && (
                                    <Tag color="blue">
                                        {(profileData?.userType || user?.userType) === 'INTL'
                                            ? 'International'
                                            : 'Local'}
                                    </Tag>
                                )}
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card bordered={false} className="shadow-sm">
                            {message.text && (
                                <Alert
                                    type={message.type === 'success' ? 'success' : 'error'}
                                    message={message.text}
                                    showIcon
                                    closable
                                    onClose={() => setMessage({ type: '', text: '' })}
                                    style={{ marginBottom: 24 }}
                                />
                            )}

                            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="name"
                                            label="Full name"
                                            rules={[{ required: true, message: 'Name is required' }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="John Doe" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email address"
                                            rules={[
                                                { required: true, message: 'Email is required' },
                                                { type: 'email', message: 'Invalid email' },
                                            ]}
                                        >
                                            <Input prefix={<MailOutlined />} placeholder="john@example.com" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="country" label="Country">
                                            <Input prefix={<GlobalOutlined />} placeholder="United States" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item name="aboutUser" label="Bio / about">
                                            <TextArea rows={3} placeholder="Tell us a bit about yourself…" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider orientation="left">Security</Divider>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                    Leave blank to keep your current password
                                </Text>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="password" label="New password">
                                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="confirmPassword" label="Confirm password">
                                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        size="large"
                                        block
                                    >
                                        Save changes
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Profile;
