import React from 'react';
import { FaUsers, FaDollarSign, FaChartLine, FaBell } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full">
              <FaUsers className="text-2xl" />
            </div>
            <span className="text-sm font-medium bg-blue-700 bg-opacity-40 px-2 py-1 rounded">+12%</span>
          </div>
          <div>
            <h3 className="text-blue-100 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold">1,254</p>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-full">
              <FaDollarSign className="text-2xl" />
            </div>
            <span className="text-sm font-medium bg-green-700 bg-opacity-40 px-2 py-1 rounded">+8%</span>
          </div>
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-1">Revenue</h3>
            <p className="text-3xl font-bold">$45,231</p>
          </div>
        </div>

        {/* Card 3: Active Sessions */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-full">
              <FaChartLine className="text-2xl" />
            </div>
            <span className="text-sm font-medium bg-purple-700 bg-opacity-40 px-2 py-1 rounded">-3%</span>
          </div>
          <div>
            <h3 className="text-purple-100 text-sm font-medium mb-1">Active Sessions</h3>
            <p className="text-3xl font-bold">342</p>
          </div>
        </div>

        {/* Card 4: Pending Alerts */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-red-400 bg-opacity-30 rounded-full">
              <FaBell className="text-2xl" />
            </div>
            <span className="text-sm font-medium bg-red-700 bg-opacity-40 px-2 py-1 rounded">5 New</span>
          </div>
          <div>
            <h3 className="text-red-100 text-sm font-medium mb-1">Pending Alerts</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      JD
                    </div>
                    <span className="font-medium text-gray-800">Jane Doe</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">Login</td>
                <td className="px-6 py-4 text-gray-500">2 mins ago</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">
                      JS
                    </div>
                    <span className="font-medium text-gray-800">John Smith</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">Updated Profile</td>
                <td className="px-6 py-4 text-gray-500">15 mins ago</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                    Pending
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold mr-3">
                      MJ
                    </div>
                    <span className="font-medium text-gray-800">Michael Jordan</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">New Order</td>
                <td className="px-6 py-4 text-gray-500">1 hour ago</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
