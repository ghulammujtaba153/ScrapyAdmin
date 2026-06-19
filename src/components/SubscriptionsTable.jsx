import React, { useState } from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import TransactionModal from './TransactionModal';

const statusColor = {
    Active: 'success',
    Pending: 'warning',
    Expired: 'error',
    Blocked: 'error',
    Invited: 'processing',
    Cancelled: 'default',
    Completed: 'processing',
};

const SubscriptionsTable = ({ data = [], loading = false }) => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (sub) => {
        setSelectedSubscription(sub);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedSubscription(null), 300);
    };

    const columns = [
        { title: 'User', dataIndex: 'user', key: 'user', render: (v) => <strong>{v}</strong> },
        { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
        { title: 'Plan', dataIndex: 'plan', key: 'plan' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => <strong>{v}</strong> },
        { title: 'Expiry', dataIndex: 'expiry', key: 'expiry', width: 120 },
        {
            title: 'Type',
            dataIndex: 'userType',
            key: 'userType',
            width: 110,
            render: (v) => <Tag>{v}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 110,
            render: (status) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
        },
        { title: 'Joined', dataIndex: 'date', key: 'date', width: 110 },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, sub) => (
                <Space>
                    <Tooltip title="View details">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(sub)} />
                    </Tooltip>
                    <Tooltip title="Download invoice">
                        <Button type="text" icon={<DownloadOutlined />} onClick={() => handleViewDetails(sub)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} subscribers` }}
                locale={{ emptyText: 'No subscribers found' }}
                scroll={{ x: 1000 }}
            />
            <TransactionModal isOpen={isModalOpen} onClose={handleCloseModal} transaction={selectedSubscription} />
        </>
    );
};

export default SubscriptionsTable;
