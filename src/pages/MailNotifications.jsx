import React, { useState, useEffect, useCallback } from 'react';
import api from '../config/url';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Typography,
    Spin,
    Empty,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    SendOutlined,
    DeleteOutlined,
    EditOutlined,
    SyncOutlined,
    BugOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import CampaignModal from '../components/CampaignModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AlertModal from '../components/AlertModal';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const { Text } = Typography;

const STATUS_CONFIG = {
    Sent: { color: 'success', icon: <CheckCircleOutlined /> },
    Draft: { color: 'processing', icon: <EditOutlined /> },
    Failed: { color: 'error', icon: <ExclamationCircleOutlined /> },
    Sending: { color: 'warning', icon: <SyncOutlined spin /> },
    Scheduled: { color: 'gold', icon: <ClockCircleOutlined /> },
};

const MailNotifications = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [sendingId, setSendingId] = useState(null);
    const [debugData, setDebugData] = useState({});
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger',
    });
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

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/campaigns');
            if (res.data.success) {
                setCampaigns(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    useEffect(() => {
        const shouldPoll = campaigns.some(
            (campaign) => campaign.status === 'Sending' || campaign.status === 'Scheduled'
        );
        if (!shouldPoll) return;
        const intervalId = setInterval(fetchCampaigns, 10000);
        return () => clearInterval(intervalId);
    }, [campaigns, fetchCampaigns]);

    const handleSave = async (payload) => {
        try {
            const { sendImmediately, ...data } = payload;
            let campaignId;

            if (selectedCampaign) {
                await api.put(`/campaigns/${selectedCampaign._id}`, data);
                campaignId = selectedCampaign._id;
            } else {
                const res = await api.post('/campaigns', data);
                campaignId = res.data.data._id;
            }

            if (sendImmediately) {
                await api.post(`/campaigns/${campaignId}/send`);
                showAlert('Success', 'Campaign saved and is now sending', 'success');
            } else {
                showAlert('Success', 'Campaign saved successfully', 'success');
            }

            setIsModalOpen(false);
            setSelectedCampaign(null);
            fetchCampaigns();
        } catch (error) {
            showAlert('Error', error.response?.data?.message || 'Something went wrong', 'error');
        }
    };

    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete campaign',
            message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await api.delete(`/campaigns/${id}`);
                    fetchCampaigns();
                    showAlert('Success', 'Campaign deleted successfully', 'success');
                } catch (error) {
                    showAlert('Error', error.response?.data?.message || 'Failed to delete campaign', 'error');
                }
            },
        });
    };

    const handleSend = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Send campaign',
            message: 'Do you want to start sending this campaign now? Emails will be sent in batches.',
            confirmText: 'Send now',
            type: 'primary',
            onConfirm: async () => {
                try {
                    setSendingId(id);
                    setCampaigns((prev) =>
                        prev.map((c) => (c._id === id ? { ...c, status: 'Sending' } : c))
                    );
                    const res = await api.post(`/campaigns/${id}/send`);
                    if (res.data.success) {
                        fetchCampaigns();
                        showAlert('Success', 'Campaign is now sending', 'success');
                    }
                } catch (error) {
                    showAlert('Error', error.response?.data?.message || 'Failed to send campaign', 'error');
                } finally {
                    setSendingId(null);
                }
            },
        });
    };

    const handleDebug = async (id) => {
        const isOpen = debugData[id]?.open;
        if (isOpen) {
            setDebugData((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
            return;
        }

        setDebugData((prev) => ({ ...prev, [id]: { open: true, loading: true, data: null } }));
        try {
            const res = await api.get(`/campaigns/${id}/debug`);
            if (res.data.success) {
                setDebugData((prev) => ({
                    ...prev,
                    [id]: { open: true, loading: false, data: res.data.data },
                }));
            }
        } catch (error) {
            setDebugData((prev) => ({
                ...prev,
                [id]: {
                    open: true,
                    loading: false,
                    data: null,
                    error: error.response?.data?.message || 'Failed to load debug info',
                },
            }));
        }
    };

    const handleReset = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Reset campaign',
            message:
                'This will reset the campaign back to Draft and set all recipients back to Pending so you can re-send. Continue?',
            confirmText: 'Reset',
            type: 'warning',
            onConfirm: async () => {
                try {
                    const res = await api.post(`/campaigns/${id}/reset`);
                    if (res.data.success) {
                        showAlert('Success', res.data.message, 'success');
                        fetchCampaigns();
                        setDebugData((prev) => ({ ...prev, [id]: undefined }));
                    }
                } catch (error) {
                    showAlert('Error', error.response?.data?.message || 'Failed to reset campaign', 'error');
                }
            },
        });
    };

    const renderDebugPanel = (campaignId) => {
        const debug = debugData[campaignId];
        if (!debug?.open) return null;

        if (debug.loading) {
            return <Spin size="small" tip="Loading recipients…" />;
        }
        if (debug.error) {
            return <Text type="danger">{debug.error}</Text>;
        }
        if (!debug.data) return null;

        return (
            <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                    FROM: <Text code>{debug.data.resendFrom}</Text>
                </Text>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {debug.data.recipients.map((r, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '8px 12px',
                                marginBottom: 4,
                                borderRadius: 6,
                                background:
                                    r.status === 'Sent'
                                        ? '#f6ffed'
                                        : r.status === 'Failed'
                                          ? '#fff2f0'
                                          : '#fffbe6',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Text code style={{ flex: 1, minWidth: 180 }}>
                                {r.email}
                            </Text>
                            <Tag
                                color={
                                    r.status === 'Sent' ? 'success' : r.status === 'Failed' ? 'error' : 'warning'
                                }
                            >
                                {r.status}
                            </Tag>
                            {r.error && (
                                <Text type="danger" style={{ fontSize: 11 }}>
                                    {r.error}
                                </Text>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const columns = [
        {
            title: 'Campaign',
            key: 'campaign',
            render: (_, record) => (
                <div>
                    <Text strong>{record.title}</Text>
                    <br />
                    <Text type="secondary" ellipsis style={{ maxWidth: 280, fontSize: 12 }}>
                        {record.subject}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status) => {
                const cfg = STATUS_CONFIG[status] || { color: 'default', icon: null };
                return (
                    <Tag color={cfg.color} icon={cfg.icon}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Stats',
            key: 'stats',
            width: 160,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <TeamOutlined /> {record.stats.total} recipients
                    </Text>
                    <Text type="success" style={{ fontSize: 12 }}>
                        <CheckCircleOutlined /> {record.stats.sent} sent
                    </Text>
                    {record.stats.failed > 0 && (
                        <Text type="danger" style={{ fontSize: 12 }}>
                            <ExclamationCircleOutlined /> {record.stats.failed} failed
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Dates',
            key: 'dates',
            width: 180,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.scheduledAt && record.status === 'Scheduled' && (
                        <Text style={{ fontSize: 12, color: '#faad14' }}>
                            <ClockCircleOutlined /> {new Date(record.scheduledAt).toLocaleString()}
                        </Text>
                    )}
                    {record.sentAt && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Sent: {new Date(record.sentAt).toLocaleString()}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            align: 'center',
            render: (_, record) => {
                const canReset = record.status === 'Failed' || record.status === 'Sending';
                const sendDisabled =
                    record.status === 'Sent' || record.status === 'Sending' || sendingId === record._id;

                return (
                    <Space>
                        <Tooltip title="Send now">
                            <Button
                                type="text"
                                icon={
                                    sendingId === record._id || record.status === 'Sending' ? (
                                        <SyncOutlined spin />
                                    ) : (
                                        <SendOutlined />
                                    )
                                }
                                disabled={sendDisabled}
                                onClick={() => handleSend(record._id)}
                            />
                        </Tooltip>
                        <Tooltip title={debugData[record._id]?.open ? 'Hide debug' : 'Inspect recipients'}>
                            <Button
                                type="text"
                                icon={<BugOutlined />}
                                onClick={() => handleDebug(record._id)}
                            />
                        </Tooltip>
                        {canReset && (
                            <Tooltip title="Reset to draft">
                                <Button type="text" icon={<SyncOutlined />} onClick={() => handleReset(record._id)} />
                            </Tooltip>
                        )}
                        {record.status === 'Draft' && (
                            <Tooltip title="Edit">
                                <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                            </Tooltip>
                        )}
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record._id)}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AdminPageHeader
                title="Mail campaigns"
                subtitle="Manage and send email notifications to your leads"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => {
                            setSelectedCampaign(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Create campaign
                    </Button>
                }
            />

            <Card bordered={false} className="shadow-sm">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={campaigns}
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} campaigns` }}
                    expandable={{
                        expandedRowKeys: Object.entries(debugData)
                            .filter(([, v]) => v?.open)
                            .map(([id]) => id),
                        expandedRowRender: (record) => (
                            <div style={{ padding: '8px 0' }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                    <BugOutlined /> Recipient debug
                                </Text>
                                {renderDebugPanel(record._id)}
                            </div>
                        ),
                        showExpandColumn: false,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="No campaigns found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setSelectedCampaign(null);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Create your first campaign
                                </Button>
                            </Empty>
                        ),
                    }}
                />
            </Card>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCampaign(null);
                }}
                campaign={selectedCampaign}
                onSave={handleSave}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
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

export default MailNotifications;
