import React, { useState } from 'react';
import { FaSearch, FaDatabase, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RecentSearches = ({ searches = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const totalPages = Math.ceil(searches.length / itemsPerPage);
    const currentSearches = searches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const date = new Date(dateString);
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Recent Searches</h3>
                <span className="text-sm text-gray-500">{searches.length} recent</span>
            </div>
            
            <div className="divide-y divide-gray-100">
                {searches.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        <FaSearch className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p>No search history found</p>
                    </div>
                ) : (
                    currentSearches.map((search) => (
                        <div key={search._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FaSearch className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 line-clamp-1">
                                            {search.searchString || 'Unknown search'}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="flex items-center text-sm text-gray-500">
                                                <FaDatabase className="mr-1 text-xs" />
                                                {search.recordCount || 0} records
                                            </span>
                                            <span className="flex items-center text-sm text-gray-500">
                                                <FaClock className="mr-1 text-xs" />
                                                {getTimeAgo(search.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {formatDate(search.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg border flex items-center justify-center transition-colors
                                ${currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'}`}
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg border flex items-center justify-center transition-colors
                                ${currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'}`}
                        >
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentSearches;
