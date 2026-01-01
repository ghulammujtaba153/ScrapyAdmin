import React, { useState, useEffect } from 'react';
import { FaUsers, FaDollarSign, FaChartLine, FaBell, FaSearch, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import {
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
  AreaChartComponent,
  DonutChartComponent,
  ChartFilter
} from '../components/charts';
import { BASE_URL } from '../config/url';

const Home = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    userGrowthPercent: 0,
    totalRevenue: 0,
    revenueGrowthPercent: 0,
    activeSubscriptions: 0,
    subscriptionGrowthPercent: 0,
    totalSearches: 0,
    searchGrowthPercent: 0,
    totalRecords: 0
  });
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    activity: [],
    subscriptions: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin-dashboard?period=${timeFilter}`);
      setStats(res.data.stats);
      setChartData(res.data.chartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  return (
    <div className="p-6">
      {/* Header with Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard Overview</h1>
        <ChartFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {/* Card 1: Total Users */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-blue-400 bg-opacity-30 rounded-full">
                  <FaUsers className="text-2xl" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${stats.userGrowthPercent >= 0 ? 'bg-blue-700 bg-opacity-40' : 'bg-red-500 bg-opacity-40'}`}>
                  {stats.userGrowthPercent >= 0 ? '+' : ''}{stats.userGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-blue-100 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 2: Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-green-400 bg-opacity-30 rounded-full">
                  <FaDollarSign className="text-2xl" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${stats.revenueGrowthPercent >= 0 ? 'bg-green-700 bg-opacity-40' : 'bg-red-500 bg-opacity-40'}`}>
                  {stats.revenueGrowthPercent >= 0 ? '+' : ''}{stats.revenueGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-green-100 text-sm font-medium mb-1">Revenue</h3>
                <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 3: Subscriptions */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-orange-400 bg-opacity-30 rounded-full">
                  <FaBell className="text-2xl" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${stats.subscriptionGrowthPercent >= 0 ? 'bg-orange-700 bg-opacity-40' : 'bg-red-500 bg-opacity-40'}`}>
                  {stats.subscriptionGrowthPercent >= 0 ? '+' : ''}{stats.subscriptionGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-orange-100 text-sm font-medium mb-1">Subscriptions</h3>
                <p className="text-3xl font-bold">{stats.activeSubscriptions.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 4: Total Searches */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-purple-400 bg-opacity-30 rounded-full">
                  <FaSearch className="text-2xl" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${stats.searchGrowthPercent >= 0 ? 'bg-purple-700 bg-opacity-40' : 'bg-red-500 bg-opacity-40'}`}>
                  {stats.searchGrowthPercent >= 0 ? '+' : ''}{stats.searchGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-purple-100 text-sm font-medium mb-1">Total Searches</h3>
                <p className="text-3xl font-bold">{stats.totalSearches.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 5: Total Records */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-cyan-400 bg-opacity-30 rounded-full">
                  <FaDatabase className="text-2xl" />
                </div>
                <span className="text-sm font-medium bg-cyan-700 bg-opacity-40 px-2 py-1 rounded">Total</span>
              </div>
              <div>
                <h3 className="text-cyan-100 text-sm font-medium mb-1">Records Scraped</h3>
                <p className="text-3xl font-bold">{stats.totalRecords.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 6: Active Users */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-pink-400 bg-opacity-30 rounded-full">
                  <FaChartLine className="text-2xl" />
                </div>
                <span className="text-sm font-medium bg-pink-700 bg-opacity-40 px-2 py-1 rounded">Live</span>
              </div>
              <div>
                <h3 className="text-pink-100 text-sm font-medium mb-1">Active Users</h3>
                <p className="text-3xl font-bold">{stats.activeSubscriptions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AreaChartComponent
              data={chartData.revenue}
              title="Revenue Overview"
              areas={[
                { dataKey: 'revenue', color: '#10B981', name: 'Revenue' }
              ]}
              height={320}
            />
            <LineChartComponent
              data={chartData.userGrowth}
              title="User Growth"
              lines={[
                { dataKey: 'users', color: '#3B82F6', name: 'Total Users' },
                { dataKey: 'newUsers', color: '#8B5CF6', name: 'New Users' }
              ]}
              height={320}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <DonutChartComponent
              data={chartData.subscriptions}
              title="Subscription Distribution"
              centerLabel="Subscribers"
              height={320}
            />
            <BarChartComponent
              data={chartData.activity}
              title="Scraping Activity"
              bars={[
                { dataKey: 'searches', color: '#8B5CF6', name: 'Searches' },
                { dataKey: 'records', color: '#10B981', name: 'Records' }
              ]}
              height={320}
            />
            <PieChartComponent
              data={chartData.subscriptions}
              title="Plan Distribution"
              height={320}
              innerRadius={0}
              outerRadius={90}
            />
          </div>

          {/* Charts Row 3 - Full Width */}
          <div className="mb-8">
            <BarChartComponent
              data={chartData.revenue}
              title="Monthly Revenue"
              bars={[
                { dataKey: 'revenue', color: '#10B981', name: 'Revenue' }
              ]}
              height={350}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
