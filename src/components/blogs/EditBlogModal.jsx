import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import api from "../../config/url";
import { FaTimes } from "react-icons/fa";

const EditBlogModal = ({ isOpen, onClose, onRefresh, blog, showAlert }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
        }
    }, [blog]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.put(`/blog/${blog._id}`, { title, content });
            onRefresh();
            onClose();
            showAlert("Updated!", "Blog post updated successfully.", "success");
        } catch (error) {
            console.error("Error updating blog:", error);
            showAlert("Error", "Failed to update blog. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit Blog</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Enter blog title..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                        <div className="min-h-[300px]">
                            <JoditEditor
                                value={content}
                                onChange={(newContent) => setContent(newContent)}
                            />
                        </div>
                    </div>
                </form>

                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBlogModal;
