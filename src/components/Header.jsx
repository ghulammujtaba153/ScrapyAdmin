import React from 'react';
import { useUserAuth } from '../context/userAuth';
import { Layout, Button, Avatar, Typography, Flex, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ toggleSidebar, sidebarOpen }) => {
    const { user } = useUserAuth();
    const { token } = theme.useToken();

    return (
        <AntHeader
            style={{
                padding: '0 24px',
                background: token.colorBgContainer,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 64,
                lineHeight: '64px',
            }}
        >
            <Flex align="center" gap={12}>
                <Button
                    type="text"
                    icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                />
                <Text strong style={{ fontSize: 16 }}>
                    Dashboard
                </Text>
            </Flex>

            <Flex align="center" gap={12}>
                <div style={{ textAlign: 'right', lineHeight: 1.3 }} className="hidden sm:block">
                    <Text strong>{user?.name || 'User'}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>
                        {user?.role || 'Admin'}
                    </Text>
                </div>
                <Avatar
                    size={40}
                    style={{ backgroundColor: '#0F792C' }}
                    icon={!user?.name && <UserOutlined />}
                >
                    {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
            </Flex>
        </AntHeader>
    );
};

export default Header;
