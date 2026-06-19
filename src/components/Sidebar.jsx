import React from 'react';
import { useUserAuth } from '../context/userAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    LineChartOutlined,
    MailOutlined,
    ReadOutlined,
    InboxOutlined,
    LogoutOutlined,
    CloseOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const navItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/user-management', icon: <UserOutlined />, label: 'User Management' },
    { key: '/subscriptions', icon: <LineChartOutlined />, label: 'Subscriptions' },
    { key: '/mail-notifications', icon: <MailOutlined />, label: 'Mail Notifications' },
    { key: '/blogs', icon: <ReadOutlined />, label: 'Blogs' },
    { key: '/mail-messages', icon: <InboxOutlined />, label: 'Mail Messages' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
];

const Sidebar = ({ isOpen, setIsOpen, toggleSidebar }) => {
    const { logout } = useUserAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = theme.useToken();

    const selectedKey = navItems.find((item) =>
        item.key === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.key)
    )?.key || '/';

    const handleMenuClick = ({ key }) => {
        navigate(key);
        if (window.innerWidth < 768) setIsOpen(false);
    };

    return (
        <>
            <Sider
                width={256}
                collapsed={!isOpen}
                collapsedWidth={0}
                trigger={null}
                breakpoint="md"
                style={{
                    background: token.colorBgContainer,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                    height: '100vh',
                    position: 'relative',
                    zIndex: 40,
                    overflow: 'hidden',
                }}
                className={`${isOpen ? '' : 'max-md:!w-0 max-md:!min-w-0 max-md:!max-w-0'} max-md:fixed max-md:left-0 max-md:top-0`}
            >
                <div
                    style={{
                        height: 64,
                        padding: '0 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    }}
                >
                    <img src="/logo.png" alt="Logo" style={{ height: 40, objectFit: 'contain' }} />
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={toggleSidebar}
                        className="md:hidden"
                        aria-label="Close sidebar"
                    />
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={navItems}
                    onClick={handleMenuClick}
                    style={{ border: 'none', padding: '8px 0', flex: 1 }}
                />

                <div style={{ padding: 16, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
                    <Button
                        type="text"
                        danger
                        block
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                    >
                        Logout
                    </Button>
                </div>
            </Sider>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                    aria-hidden
                />
            )}
        </>
    );
};

export default Sidebar;
