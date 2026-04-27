import React from 'react';
import { useUserAuth } from '../context/userAuth';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaBoxOpen, FaChartLine, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen, toggleSidebar }) => {
    const { logout } = useUserAuth();

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <FaHome /> },
        { path: '/user-management', name: 'User Management', icon: <FaUser /> },
        { path: '/subscriptions', name: 'Subscriptions', icon: <FaChartLine /> },
        { path: "/mail-notifications", name: "Mail Notifications", icon: <FaBoxOpen /> },
        { path: "/profile", name: "Profile", icon: <FaUser /> }
    ];

    return (
        <div className="flex h-screen md:flex-row flex-col z-50 transition-all duration-300 ease-in-out">
            {/* Sidebar */}
            <div className={`
             fixed inset-y-0 left-0 bg-gray-50 text-gray-800 w-64 transition-all duration-300 ease-in-out border-r border-gray-200
             ${isOpen ? "translate-x-0" : "-translate-x-full"}
             md:translate-x-0 md:static ${isOpen ? "md:w-64" : "md:w-0"} md:flex flex-col z-40 shadow-sm overflow-hidden
          `}>
                <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 bg-gray-50">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-32 h-22"
                    />
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-400 hover:text-primary focus:outline-none md:hidden"
                        aria-label="Close Sidebar"
                    >
                        <FaTimes size={20} />
                    </button>
                    {/* Desktop hidden button to collapse if desired */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:block p-1 text-gray-300 hover:text-gray-500 focus:outline-none"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm border border-primary/10'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
                                }`
                            }
                            onClick={() => {
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                        >
                            <span className={`mr-3 text-lg ${item.path === window.location.pathname ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>{item.icon}</span>
                            <span className="font-semibold">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 group font-medium"
                    >
                        <span className="mr-3 text-lg group-hover:rotate-12 transition-transform duration-300"><FaSignOutAlt /></span>
                        <span>Logout</span>
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
