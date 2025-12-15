import React, { useState, useEffect } from 'react';
import { FaEye, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TransactionModal from './TransactionModal';

const SubscriptionsTable = ({ data = [], loading = false }) => {
    // data comes from parent now

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Modal State
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculation
    // If data is empty and loading, safe check
    const safeData = data || [];
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(safeData.length / rowsPerPage);

    // Handlers
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const handleViewDetails = (sub) => {
        setSelectedSubscription(sub);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedSubscription(null), 300); // Wait for animation
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-700 bg-green-100';
            case 'Pending': return 'text-yellow-700 bg-yellow-100';
            case 'Cancelled': return 'text-red-700 bg-red-100';
            case 'Completed': return 'text-blue-700 bg-blue-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center text-gray-500">
                Loading subscriptions...
            </div>
        );
    }

    if (safeData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center text-gray-500">
                No recent transactions found.
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                    <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg transition-colors">Export CSV</button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg transition-colors">Print</button>
                    </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentItems.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{sub.user}</td>
                                    <td className="px-6 py-4 text-gray-600">{sub.plan}</td>
                                    <td className="px-6 py-4 text-gray-500">{sub.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{sub.amount}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => handleViewDetails(sub)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(sub)}
                                                className="text-gray-400 hover:text-green-600 transition-colors"
                                                title="Download Invoice"
                                            >
                                                <FaDownload size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <span>Show</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 bg-white"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span>
                            Showing {Math.min(indexOfFirstItem + 1, safeData.length)} to {Math.min(indexOfLastItem, safeData.length)} of {safeData.length} entries
                        </span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200 hover:text-blue-600'}`}
                        >
                            <FaChevronLeft />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`px-3 py-1 rounded-md transition-colors ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200 hover:text-blue-600'}`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                transaction={selectedSubscription}
            />
        </>
    );
};

export default SubscriptionsTable;
