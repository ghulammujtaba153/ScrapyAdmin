import React from "react";
import { FaTimes } from "react-icons/fa";

const ViewBlogModal = ({ isOpen, onClose, blog }) => {
    if (!isOpen || !blog) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="prose prose-lg max-w-none prose-primary">
                        {/* Safely render HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                    
                    <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                        Published on: {new Date(blog.createdAt || blog.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewBlogModal;
