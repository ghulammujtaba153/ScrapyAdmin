import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import UserModal from '../components/UserModal';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/auth/users`, {
                params: {
                    page,
                    limit: 10,
                    search,
                    status: statusFilter
                }
            });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, statusFilter]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${BASE_URL}/auth/deleteUser/${id}`);
                setUsers(prev => prev.filter(u => u._id !== id));
            } catch (error) {
                console.error("Error deleting user", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleSave = () => {
        fetchUsers(); // Refresh list after save/update
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/auth/update/${userId}`, { status: newStatus });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="under_review">Under Review</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>

                    <button
                        onClick={handleInvite}
                        className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition duration-300 whitespace-nowrap shadow-sm"
                    >
                        <FaPlus className="mr-2" /> Invite User
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Country
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">No users found.</td></tr>
                            ) : users.map((u) => (
                                <tr key={u._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap font-semibold">
                                                    {u.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{u.email}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${u.role === 'admin' ? 'text-green-900' : 'text-gray-900'}`}>
                                            <span aria-hidden className={`absolute inset-0 ${u.role === 'admin' ? 'bg-green-200' : 'bg-gray-200'} opacity-50 rounded-full`}></span>
                                            <span className="relative">{u.role}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <select
                                            value={u.status || 'under_review'}
                                            onChange={(e) => handleStatusChange(u._id, e.target.value)}
                                            className={`relative inline-block px-2 py-1 font-semibold leading-tight rounded-full border border-gray-200 focus:ring-2 focus:ring-primary cursor-pointer text-xs
                                                ${(u.status === 'active') ? 'bg-green-100 text-green-800' : 
                                                  (u.status === 'blocked') ? 'bg-red-100 text-red-800' : 
                                                  (u.status === 'under_review') ? 'bg-yellow-100 text-yellow-800' : 
                                                  'bg-gray-100 text-gray-800'}`}
                                        >
                                            <option value="under_review">Under Review</option>
                                            <option value="active">Active</option>
                                            <option value="blocked">Blocked</option>
                                            <option value="invited">Invited</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{u.country || '-'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center justify-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewUser(u._id)}
                                                className="text-green-600 hover:text-green-900 mx-2"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="text-primary hover:text-primary/70 mx-2"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                className="text-red-600 hover:text-red-900 mx-2"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                    <span className="text-xs xs:text-sm text-gray-900">
                        Showing Page {page} of {totalPages}
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages || totalPages === 0}
                            className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${page === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                onSave={handleSave}
            />
        </div>
    );
};

export default UserManagement;
