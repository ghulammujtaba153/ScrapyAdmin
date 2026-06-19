import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import {
    Table,
    Card,
    Input,
    Select,
    Button,
    Tag,
    Space,
    Typography,
    Tooltip,
    Avatar,
    Flex,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SendOutlined,
    UserOutlined,
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import UserModal from '../components/UserModal';
import SendPaymentLinkModal from '../components/SendPaymentLinkModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AlertModal from '../components/AlertModal';

const { Title, Text } = Typography;

const STATUS_OPTIONS = [
    { value: '', label: 'All status' },
    { value: 'under_review', label: 'Under review' },
    { value: 'active', label: 'Active' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'invited', label: 'Invited' },
];

const ACCOUNT_TAG = {
    subscriber_owner: { color: 'purple', label: 'Subscriber · Team owner' },
    subscriber: { color: 'blue', label: 'Subscriber' },
    invited_member: { color: 'gold', label: 'Invited member' },
};

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);
    const [paymentLinkUser, setPaymentLinkUser] = useState(null);

    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'primary',
    });

    const openConfirmModal = (title, message, onConfirm, type = 'primary') => {
        setConfirmModalState({ isOpen: true, title, message, onConfirm, type });
    };

    const closeConfirmModal = () => {
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
    };

    const [alertModalState, setAlertModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
    });

    const showAlert = (title, message, type = 'info') => {
        setAlertModalState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertModalState((prev) => ({ ...prev, isOpen: false }));
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/auth/users`, {
                params: { page, limit: pageSize, search, status: statusFilter },
            });
            setUsers(res.data.users);
            setTotalUsers(res.data.totalUsers ?? 0);
        } catch (error) {
            console.error('Error fetching users', error);
            showAlert('Error', 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(fetchUsers, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [page, search, statusFilter]);

    const handleInvite = () => {
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleViewUser = (userId) => {
        navigate(`/user-management/${userId}`);
    };

    const handleDelete = (id) => {
        openConfirmModal(
            'Delete user',
            'Are you sure you want to delete this user? This action cannot be undone.',
            async () => {
                try {
                    await axios.delete(`${BASE_URL}/auth/deleteUser/${id}`);
                    setUsers((prev) => prev.filter((u) => u._id !== id));
                    setTotalUsers((prev) => Math.max(0, prev - 1));
                } catch (error) {
                    console.error('Error deleting user', error);
                    showAlert('Error', 'Failed to delete user', 'error');
                }
            },
            'danger'
        );
    };

    const handleStatusChange = (userId, newStatus) => {
        openConfirmModal(
            'Change status',
            `Change this user's status to "${newStatus.replace('_', ' ')}"?`,
            async () => {
                try {
                    await axios.put(`${BASE_URL}/auth/update/${userId}`, { status: newStatus });
                    setUsers((prev) =>
                        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
                    );
                } catch (error) {
                    console.error('Error updating status', error);
                    showAlert('Error', 'Failed to update status', 'error');
                }
            },
            'warning'
        );
    };

    const handleOpenPaymentLinkModal = (user) => {
        setPaymentLinkUser(user);
        setIsPaymentLinkModalOpen(true);
    };

    const handleSendPaymentLink = async (paymentLink) => {
        if (!paymentLinkUser) return;
        try {
            await axios.post(`${BASE_URL}/auth/send-payment-link/${paymentLinkUser._id}`, { paymentLink });
            showAlert('Success', 'Payment link email sent successfully', 'success');
        } catch (error) {
            console.error('Error sending payment link', error);
            showAlert('Error', error.response?.data?.message || 'Failed to send payment link', 'error');
            throw error;
        }
    };

    const columns = [
            {
                title: 'User',
                key: 'user',
                fixed: 'left',
                width: 220,
                render: (_, u) => (
                    <Flex align="center" gap={12}>
                        <Avatar
                            style={{ backgroundColor: '#0F792C' }}
                            icon={!u.name ? <UserOutlined /> : undefined}
                        >
                            {u.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <div>
                            <Text strong>{u.name || '—'}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {u.email}
                            </Text>
                        </div>
                    </Flex>
                ),
            },
            {
                title: 'Role',
                dataIndex: 'role',
                width: 100,
                render: (role) => (
                    <Tag color={role === 'admin' ? 'green' : 'default'}>{role || 'user'}</Tag>
                ),
            },
            {
                title: 'Type',
                dataIndex: 'userType',
                width: 90,
                render: (_, u) => (
                    <Tag>{(u.userType || u.type || 'local').toUpperCase()}</Tag>
                ),
            },
            {
                title: 'Account',
                dataIndex: 'accountType',
                width: 160,
                render: (accountType) => {
                    const cfg = ACCOUNT_TAG[accountType];
                    return cfg ? (
                        <Tag color={cfg.color}>{cfg.label}</Tag>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            No subscription
                        </Text>
                    );
                },
            },
            {
                title: 'Team / invitation',
                key: 'team',
                width: 200,
                render: (_, u) => {
                    if (u.invitedBy) {
                        return (
                            <div>
                                <Text style={{ fontSize: 12 }}>
                                    Invited by <Text strong>{u.invitedBy.name}</Text>
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    {u.invitedBy.email}
                                </Text>
                                {u.teamName && (
                                    <>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Team: {u.teamName}
                                        </Text>
                                    </>
                                )}
                            </div>
                        );
                    }
                    if (u.invitedMembers?.length > 0) {
                        return (
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    Invited {u.invitedMembers.length} member(s)
                                </Text>
                                {u.invitedMembers.slice(0, 2).map((m) => (
                                    <div key={m._id}>
                                        <Text style={{ fontSize: 12 }}>{m.name}</Text>
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return <Text type="secondary">—</Text>;
                },
            },
            {
                title: 'Status',
                dataIndex: 'status',
                width: 150,
                render: (status, u) => (
                    <Select
                        size="small"
                        value={status || 'under_review'}
                        style={{ width: 130 }}
                        options={STATUS_OPTIONS.filter((o) => o.value !== '')}
                        onChange={(val) => handleStatusChange(u._id, val)}
                        status={status === 'blocked' ? 'error' : undefined}
                    />
                ),
            },
            {
                title: 'Country',
                dataIndex: 'country',
                width: 100,
                render: (country) => country || '—',
            },
            {
                title: 'Joined',
                dataIndex: 'createdAt',
                width: 110,
                render: (date) =>
                    date ? new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—',
            },
            {
                title: 'Payment',
                key: 'payment',
                width: 130,
                render: (_, u) =>
                    String(u.userType || '').toLowerCase() === 'intl' ? (
                        <Button
                            type="link"
                            size="small"
                            icon={<SendOutlined />}
                            onClick={() => handleOpenPaymentLinkModal(u)}
                        >
                            Send link
                        </Button>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Local flow
                        </Text>
                    ),
            },
            {
                title: 'Actions',
                key: 'actions',
                fixed: 'right',
                width: 120,
                render: (_, u) => (
                    <Space size="small">
                        <Tooltip title="View details">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewUser(u._id)}
                            />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(u)} />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(u._id)}
                            />
                        </Tooltip>
                    </Space>
                ),
            },
        ];

    return (
        <div className="max-w-[1600px] mx-auto">
            <Card bordered={false} className="shadow-sm">
                <Flex
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    gap={16}
                    style={{ marginBottom: 24 }}
                >
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            User management
                        </Title>
                        <Text type="secondary">
                            Manage subscribers, invited members, and account status
                        </Text>
                    </div>
                    <Space wrap>
                        <Input
                            allowClear
                            placeholder="Search name or email…"
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            style={{ width: 260 }}
                        />
                        <Select
                            value={statusFilter}
                            options={STATUS_OPTIONS}
                            onChange={(val) => {
                                setStatusFilter(val);
                                setPage(1);
                            }}
                            style={{ width: 160 }}
                        />
                        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
                            Refresh
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleInvite}>
                            Invite user
                        </Button>
                    </Space>
                </Flex>

                <Flex gap={12} wrap style={{ marginBottom: 16 }}>
                    <Tag color="green" style={{ padding: '4px 12px', fontSize: 13 }}>
                        Total: {totalUsers}
                    </Tag>
                </Flex>

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    scroll={{ x: 1400 }}
                    pagination={{
                        current: page,
                        pageSize,
                        total: totalUsers,
                        showSizeChanger: false,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`,
                        onChange: (p) => setPage(p),
                    }}
                    size="middle"
                />
            </Card>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                onSave={fetchUsers}
                showAlert={showAlert}
            />

            <SendPaymentLinkModal
                isOpen={isPaymentLinkModalOpen}
                onClose={() => {
                    setIsPaymentLinkModalOpen(false);
                    setPaymentLinkUser(null);
                }}
                user={paymentLinkUser}
                onSend={handleSendPaymentLink}
            />

            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
                type={confirmModalState.type}
            />

            <AlertModal
                isOpen={alertModalState.isOpen}
                onClose={closeAlert}
                title={alertModalState.title}
                message={alertModalState.message}
                type={alertModalState.type}
            />
        </div>
    );
};

export default UserManagement;
