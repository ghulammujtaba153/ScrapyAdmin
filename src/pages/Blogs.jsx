import React, { useState, useEffect } from 'react';
import api from '../config/url';
import { Card, Table, Button, Space, Typography, Empty } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import CreateBlogModal from '../components/blogs/CreateBlogModal';
import EditBlogModal from '../components/blogs/EditBlogModal';
import ViewBlogModal from '../components/blogs/ViewBlogModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AlertModal from '../components/AlertModal';
import AdminPageHeader from '../components/admin/AdminPageHeader';

const { Text } = Typography;

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: () => {}, title: '', message: '' });

    const showAlert = (title, message, type = 'info') => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

    const showConfirm = (title, message, onConfirm) => {
        setConfirmConfig({ isOpen: true, title, message, onConfirm });
    };

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/blog?page=${page}&limit=${itemsPerPage}`);
            setBlogs(res.data.data);
            if (res.data.pagination) {
                setTotalPages(res.data.pagination.totalPages);
                setCurrentPage(res.data.pagination.page);
                setTotalItems(res.data.pagination.total || res.data.data.length);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setIsEditOpen(true);
    };

    const handleView = (blog) => {
        setSelectedBlog(blog);
        setIsViewOpen(true);
    };

    const handleDelete = (id) => {
        showConfirm('Delete blog?', 'Are you sure you want to permanently remove this blog post?', async () => {
            try {
                await api.delete(`/blog/${id}`);
                fetchBlogs(currentPage);
                showAlert('Deleted', 'The blog has been successfully removed.', 'success');
            } catch (error) {
                console.error('Error deleting blog:', error);
                showAlert('Error', 'Failed to delete the blog. Please try again.', 'error');
            }
        });
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title) => <Text strong>{title}</Text>,
        },
        {
            title: 'Date',
            key: 'date',
            width: 160,
            render: (_, blog) =>
                new Date(blog.createdAt || blog.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 140,
            align: 'right',
            render: (_, blog) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(blog)} title="View" />
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(blog)} title="Edit" />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(blog._id)}
                        title="Delete"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AdminPageHeader
                title="Blogs management"
                subtitle="Create and manage your articles and news updates"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsCreateOpen(true)}>
                        Create new blog
                    </Button>
                }
            />

            <Card bordered={false} className="shadow-sm">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={blogs}
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        total: totalItems || totalPages * itemsPerPage,
                        pageSize: itemsPerPage,
                        showSizeChanger: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} posts`,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="No blogs found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
                                    Create your first blog
                                </Button>
                            </Empty>
                        ),
                    }}
                />
            </Card>

            <CreateBlogModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onRefresh={() => fetchBlogs(currentPage)}
                showAlert={showAlert}
            />
            <EditBlogModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedBlog(null);
                }}
                onRefresh={() => fetchBlogs(currentPage)}
                blog={selectedBlog}
                showAlert={showAlert}
            />
            <ViewBlogModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedBlog(null);
                }}
                blog={selectedBlog}
            />

            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
            />
            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};

export default Blogs;
