'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { FiPackage, FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  salesChart: {
    labels: string[];
    data: number[];
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    recentOrders: [],
    salesChart: {
      labels: [],
      data: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats from your API
    const fetchStats = async () => {
      try {
        // Simulated API response
        const data = {
          totalProducts: 150,
          totalRevenue: 25000,
          totalCustomers: 450,
          totalOrders: 280,
          recentOrders: [
            {
              id: '1',
              customer: 'John Doe',
              amount: 199.99,
              status: 'Completed',
              date: '2024-02-15',
            },
            // Add more orders as needed
          ],
          salesChart: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [3000, 3500, 2800, 4200, 4800, 5000],
          },
        };
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      trend: '+12%',
      trendUp: true,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      trend: '+25%',
      trendUp: true,
      color: 'bg-green-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: FiUsers,
      trend: '+18%',
      trendUp: true,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingCart,
      trend: '-5%',
      trendUp: false,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trendUp ? (
                    <FiTrendingUp className="text-green-500" />
                  ) : (
                    <FiTrendingDown className="text-red-500" />
                  )}
                  <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-600 text-sm">{stat.title}</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.amount}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiPackage className="w-6 h-6 text-indigo-600 mx-auto" />
                  <span className="block mt-2 text-sm font-medium text-gray-900">Add Product</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiUsers className="w-6 h-6 text-indigo-600 mx-auto" />
                  <span className="block mt-2 text-sm font-medium text-gray-900">View Customers</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiShoppingCart className="w-6 h-6 text-indigo-600 mx-auto" />
                  <span className="block mt-2 text-sm font-medium text-gray-900">Process Orders</span>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiDollarSign className="w-6 h-6 text-indigo-600 mx-auto" />
                  <span className="block mt-2 text-sm font-medium text-gray-900">View Revenue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 