import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { 
  CheckCircle, Clock, List, Layout, Sparkles, Activity as ActivityIcon 
} from 'lucide-react';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const statCards = [
    { title: 'Total Projects', value: stats?.total_projects, icon: <Layout className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Total Tasks', value: stats?.total_tasks, icon: <List className="text-purple-500" />, color: 'bg-purple-50' },
    { title: 'Completed', value: stats?.completed_tasks, icon: <CheckCircle className="text-green-500" />, color: 'bg-green-50' },
    { title: 'Pending', value: stats?.pending_tasks, icon: <Clock className="text-orange-500" />, color: 'bg-orange-50' },
  ];

  const chartData = stats?.analytics.labels.map((label, index) => ({
    name: label,
    tasks: stats.analytics.data[index]
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Productivity Dashboard</h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">Productivity Score:</span>
          <span className="text-lg font-bold text-blue-600">{stats?.productivity_percentage}%</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Task Completion (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="text-yellow-500" size={20} />
            <h3 className="text-lg font-bold text-gray-800">AI Suggestions</h3>
          </div>
          <div className="space-y-4">
            {stats?.ai_suggestions.length > 0 ? stats.ai_suggestions.map((s, i) => (
              <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 font-medium">
                {s}
              </div>
            )) : (
              <p className="text-gray-500 text-sm">All caught up! Great job.</p>
            )}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 italic">Based on your recent activity and deadlines.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-2 mb-4">
          <ActivityIcon className="text-gray-400" size={20} />
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {stats?.recent_activities.map((activity, i) => (
            <div key={i} className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-gray-700">{activity.action}</p>
                <p className="text-gray-400 text-xs">{new Date(activity.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
