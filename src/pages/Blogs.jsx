import React, { useState, useEffect } from "react";
import api from "../config/url";
import { FaPlus, FaEdit, FaTrash, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CreateBlogModal from "../components/blogs/CreateBlogModal";
import EditBlogModal from "../components/blogs/EditBlogModal";
import ViewBlogModal from "../components/blogs/ViewBlogModal";
import ConfirmationModal from "../components/ConfirmationModal";
import AlertModal from "../components/AlertModal";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Feedback states
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: () => {}, title: "", message: "" });

    const showAlert = (title, message, type = "info") => {
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
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
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

    const handleDelete = async (id) => {
        showConfirm(
            "Delete Blog?",
            "Are you sure you want to permanently remove this blog post?",
            async () => {
                try {
                    await api.delete(`/blog/${id}`);
                    fetchBlogs(currentPage);
                    showAlert("Deleted!", "The blog has been successfully removed.", "success");
                } catch (error) {
                    console.error("Error deleting blog:", error);
                    showAlert("Error", "Failed to delete the blog. Please try again.", "error");
                }
            }
        );
    };
    
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Blogs Management</h1>
                    <p className="text-gray-500 mt-1">Create and manage your articles and news updates.</p>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                >
                    <FaPlus />
                    <span>Create New Blog</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Fetching your blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPlus className="text-gray-300 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No Blogs Found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start sharing your thoughts by creating your first blog post today.</p>
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Create now
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                        <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Date</th>
                                        <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {blogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                                                    {blog.title}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 font-medium">
                                                {new Date(blog.createdAt || blog.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleView(blog)}
                                                        className="p-3 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                                                        title="View"
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(blog)}
                                                        className="p-3 text-gray-400 hover:text-amber-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white/50"
                                >
                                    <FaChevronLeft size={14} className="text-gray-600" />
                                </button>
                                
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        // Simple logic to show current, first, last, and neighbors
                                        if (
                                            pageNum === 1 || 
                                            pageNum === totalPages || 
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                                        currentPage === pageNum 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                        : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 || 
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="flex items-end pb-2 px-1 text-gray-400">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white/50"
                                >
                                    <FaChevronRight size={14} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
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

            {/* Feedback Modals */}
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