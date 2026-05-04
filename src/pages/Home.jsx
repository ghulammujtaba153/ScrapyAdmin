import React, { useState, useEffect } from 'react';
import { FaUsers, FaDollarSign, FaChartLine, FaBell, FaSearch, FaDatabase } from 'react-icons/fa';
import api from '../config/url';
import {
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
  AreaChartComponent,
  DonutChartComponent,
  ChartFilter
} from '../components/charts';

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
    totalRecords: 0,
    recordGrowthPercent: 0
  });
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    activity: [],
    subscriptions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin-dashboard?period=${timeFilter}`);
        setStats(res.data.stats);
        setChartData(res.data.chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {/* Card 1: Total Users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaUsers className="text-2xl" />
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stats.userGrowthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stats.userGrowthPercent >= 0 ? '+' : ''}{stats.userGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 2: Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaDollarSign className="text-2xl" />
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stats.revenueGrowthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stats.revenueGrowthPercent >= 0 ? '+' : ''}{stats.revenueGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Revenue</h3>
                <p className="text-3xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 3: Subscriptions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaBell className="text-2xl" />
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stats.subscriptionGrowthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stats.subscriptionGrowthPercent >= 0 ? '+' : ''}{stats.subscriptionGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Subscriptions</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.activeSubscriptions.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 4: Total Searches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaSearch className="text-2xl" />
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stats.searchGrowthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stats.searchGrowthPercent >= 0 ? '+' : ''}{stats.searchGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Searches</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSearches.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 5: Total Records */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaDatabase className="text-2xl" />
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stats.recordGrowthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stats.recordGrowthPercent >= 0 ? '+' : ''}{stats.recordGrowthPercent}%
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Records Scraped</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalRecords.toLocaleString()}</p>
              </div>
            </div>

            {/* Card 6: Active Users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <FaChartLine className="text-2xl" />
                </div>
                <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Live</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Active Users</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.activeSubscriptions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AreaChartComponent
              data={chartData.revenue}
              title="Revenue Overview"
              areas={[
                { dataKey: 'revenue', color: '#0F792C', name: 'Revenue' }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DonutChartComponent
              data={chartData.subscriptions}
              title="Subscription Distribution"
              centerLabel="Subscribers"
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
              data={chartData.activity}
              title="Scraping Activity"
              bars={[
                { dataKey: 'searches', color: '#8B5CF6', name: 'Searches' },
                { dataKey: 'records', color: '#0F792C', name: 'Records' }
              ]}
              height={350}
            />
          </div>

          {/* Charts Row 4 - Full Width */}
          <div className="mb-8">
            <BarChartComponent
              data={chartData.revenue}
              title="Monthly Revenue"
              bars={[
                { dataKey: 'revenue', color: '#0F792C', name: 'Revenue' }
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
