import React from 'react';
import { useUserAuth } from '../context/userAuth';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const { user } = useUserAuth();

    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-200 shadow-sm z-10">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <div className="text-right mr-3 hidden sm:block">
                        <p className="text-gray-800 font-semibold">{user?.name || "User"}</p>
                        <p className="text-gray-500 text-sm uppercase">{user?.role || "Admin"}</p>
                    </div>
                    <FaUserCircle className="text-3xl text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default Header;
