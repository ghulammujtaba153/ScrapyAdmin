// Sample data generator for different time filters
// In a real application, this would come from your API

export const generateChartData = (filter) => {
    switch (filter) {
        case 'weekly':
            return {
                userGrowth: [
                    { name: 'Mon', users: 120, newUsers: 45 },
                    { name: 'Tue', users: 145, newUsers: 52 },
                    { name: 'Wed', users: 132, newUsers: 38 },
                    { name: 'Thu', users: 178, newUsers: 67 },
                    { name: 'Fri', users: 195, newUsers: 73 },
                    { name: 'Sat', users: 156, newUsers: 48 },
                    { name: 'Sun', users: 142, newUsers: 41 },
                ],
                revenue: [
                    { name: 'Mon', revenue: 2400, expenses: 1200 },
                    { name: 'Tue', revenue: 3100, expenses: 1400 },
                    { name: 'Wed', revenue: 2800, expenses: 1100 },
                    { name: 'Thu', revenue: 4200, expenses: 1800 },
                    { name: 'Fri', revenue: 5100, expenses: 2100 },
                    { name: 'Sat', revenue: 3800, expenses: 1600 },
                    { name: 'Sun', revenue: 3200, expenses: 1300 },
                ],
                subscriptions: [
                    { name: 'Basic', value: 340 },
                    { name: 'Pro', value: 180 },
                    { name: 'Enterprise', value: 75 },
                    { name: 'Free Trial', value: 220 },
                ],
                activity: [
                    { name: 'Mon', sessions: 890, interactions: 2340 },
                    { name: 'Tue', sessions: 1020, interactions: 2890 },
                    { name: 'Wed', sessions: 945, interactions: 2560 },
                    { name: 'Thu', sessions: 1180, interactions: 3210 },
                    { name: 'Fri', sessions: 1350, interactions: 3780 },
                    { name: 'Sat', sessions: 980, interactions: 2670 },
                    { name: 'Sun', sessions: 850, interactions: 2190 },
                ],
            };

        case 'monthly':
            return {
                userGrowth: [
                    { name: 'Week 1', users: 850, newUsers: 320 },
                    { name: 'Week 2', users: 920, newUsers: 380 },
                    { name: 'Week 3', users: 1050, newUsers: 420 },
                    { name: 'Week 4', users: 1180, newUsers: 490 },
                ],
                revenue: [
                    { name: 'Week 1', revenue: 18500, expenses: 8200 },
                    { name: 'Week 2', revenue: 22400, expenses: 9800 },
                    { name: 'Week 3', revenue: 26800, expenses: 11400 },
                    { name: 'Week 4', revenue: 31200, expenses: 13200 },
                ],
                subscriptions: [
                    { name: 'Basic', value: 1420 },
                    { name: 'Pro', value: 780 },
                    { name: 'Enterprise', value: 320 },
                    { name: 'Free Trial', value: 950 },
                ],
                activity: [
                    { name: 'Week 1', sessions: 6200, interactions: 18500 },
                    { name: 'Week 2', sessions: 7100, interactions: 21200 },
                    { name: 'Week 3', sessions: 8400, interactions: 25100 },
                    { name: 'Week 4', sessions: 9200, interactions: 28400 },
                ],
            };

        case 'yearly':
            return {
                userGrowth: [
                    { name: 'Jan', users: 4200, newUsers: 1200 },
                    { name: 'Feb', users: 4800, newUsers: 1400 },
                    { name: 'Mar', users: 5600, newUsers: 1800 },
                    { name: 'Apr', users: 6200, newUsers: 2100 },
                    { name: 'May', users: 7100, newUsers: 2400 },
                    { name: 'Jun', users: 7800, newUsers: 2800 },
                    { name: 'Jul', users: 8500, newUsers: 3100 },
                    { name: 'Aug', users: 9200, newUsers: 3400 },
                    { name: 'Sep', users: 10100, newUsers: 3800 },
                    { name: 'Oct', users: 10800, newUsers: 4100 },
                    { name: 'Nov', users: 11600, newUsers: 4500 },
                    { name: 'Dec', users: 12540, newUsers: 4900 },
                ],
                revenue: [
                    { name: 'Jan', revenue: 45000, expenses: 22000 },
                    { name: 'Feb', revenue: 52000, expenses: 25000 },
                    { name: 'Mar', revenue: 61000, expenses: 28000 },
                    { name: 'Apr', revenue: 68000, expenses: 32000 },
                    { name: 'May', revenue: 78000, expenses: 36000 },
                    { name: 'Jun', revenue: 85000, expenses: 40000 },
                    { name: 'Jul', revenue: 92000, expenses: 44000 },
                    { name: 'Aug', revenue: 98000, expenses: 48000 },
                    { name: 'Sep', revenue: 108000, expenses: 52000 },
                    { name: 'Oct', revenue: 115000, expenses: 56000 },
                    { name: 'Nov', revenue: 125000, expenses: 60000 },
                    { name: 'Dec', revenue: 135000, expenses: 65000 },
                ],
                subscriptions: [
                    { name: 'Basic', value: 5840 },
                    { name: 'Pro', value: 3420 },
                    { name: 'Enterprise', value: 1280 },
                    { name: 'Free Trial', value: 2000 },
                ],
                activity: [
                    { name: 'Jan', sessions: 24000, interactions: 72000 },
                    { name: 'Feb', sessions: 28000, interactions: 84000 },
                    { name: 'Mar', sessions: 33000, interactions: 99000 },
                    { name: 'Apr', sessions: 38000, interactions: 114000 },
                    { name: 'May', sessions: 43000, interactions: 129000 },
                    { name: 'Jun', sessions: 48000, interactions: 144000 },
                    { name: 'Jul', sessions: 52000, interactions: 156000 },
                    { name: 'Aug', sessions: 56000, interactions: 168000 },
                    { name: 'Sep', sessions: 62000, interactions: 186000 },
                    { name: 'Oct', sessions: 66000, interactions: 198000 },
                    { name: 'Nov', sessions: 71000, interactions: 213000 },
                    { name: 'Dec', sessions: 75000, interactions: 225000 },
                ],
            };

        default:
            return generateChartData('weekly');
    }
};

// Stats calculation helpers
export const calculateStats = (data, filter) => {
    const chartData = generateChartData(filter);
    
    const totalUsers = chartData.userGrowth.reduce((sum, item) => sum + item.users, 0);
    const totalRevenue = chartData.revenue.reduce((sum, item) => sum + item.revenue, 0);
    const totalSessions = chartData.activity.reduce((sum, item) => sum + item.sessions, 0);
    const totalSubscriptions = chartData.subscriptions.reduce((sum, item) => sum + item.value, 0);

    return {
        totalUsers,
        totalRevenue,
        totalSessions,
        totalSubscriptions,
    };
};
