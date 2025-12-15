import React, { useState } from 'react';
import { useUserAuth } from '../context/userAuth';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes, FaBoxOpen, FaChartLine } from 'react-icons/fa';

const Sidebar = () => {
    const { logout } = useUserAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <FaHome /> },
        { path: '/user-management', name: 'User Management', icon: <FaUser /> },
        { path: '/subscriptions', name: 'Subscriptions', icon: <FaChartLine /> },
        { path: '/packages', name: 'Packages', icon: <FaBoxOpen /> },
    ];

    return (
        <div className="flex h-screen md:flex-row flex-col z-50">
            {/* Mobile Header & Toggle */}
            <div className="md:hidden flex justify-between items-center bg-gray-900 text-white p-4 shadow-md z-50 relative">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        AdminPanel
                    </span>
                </div>
                <button onClick={toggleSidebar} className="text-gray-300 hover:text-white focus:outline-none">
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
             fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transition-transform transform duration-300 ease-in-out
             ${isOpen ? "translate-x-0" : "-translate-x-full"}
             md:translate-x-0 md:static md:flex flex-col z-40 shadow-xl
          `}>
                <div className="flex items-center justify-center h-20 border-b border-gray-800 bg-gray-900">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        AdminPanel
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            <span className={`mr-3 text-lg group-hover:animate-pulse`}>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Placeholder for more sections if needed */}
                </nav>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group"
                    >
                        <span className="mr-3 text-lg group-hover:rotate-180 transition-transform duration-300"><FaSignOutAlt /></span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
