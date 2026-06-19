import React, { useState } from 'react';
import { useUserAuth } from '../context/userAuth';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography, Flex } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setError('');
        setLoading(true);
        const result = await login(values.email, values.password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Login failed');
        }
    };

    return (
        <Flex
            align="center"
            justify="center"
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f4ea 100%)' }}
        >
            <Card
                bordered={false}
                style={{ width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
                <Flex vertical align="center" style={{ marginBottom: 32 }}>
                    <img src="/logo.png" alt="Logo" style={{ width: 128, marginBottom: 16 }} />
                    <Title level={3} style={{ margin: 0 }}>
                        Admin sign in
                    </Title>
                    <Text type="secondary">Enter your credentials to continue</Text>
                </Flex>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        showIcon
                        closable
                        onClose={() => setError('')}
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large">
                    <Form.Item
                        name="email"
                        label="Email address"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Invalid email address' },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="you@example.com" autoComplete="email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" autoComplete="current-password" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
};

export default Login;
