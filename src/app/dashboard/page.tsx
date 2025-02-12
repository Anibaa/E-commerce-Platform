'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // In a real application, you would fetch these from your API
      setOrders([
        {
          id: '1',
          date: '2024-02-12',
          total: 199.99,
          status: 'Delivered',
          items: 2,
        },
        // Add more orders as needed
      ]);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your account.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
            <Link
              href="/orders"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              View Orders →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">My Wishlist</h3>
            <p className="text-gray-600 mt-2">Products you've saved for later</p>
            <Link
              href="/wishlist"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              View Wishlist →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            <p className="text-gray-600 mt-2">Update your profile and preferences</p>
            <Link
              href="/profile"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              Edit Profile →
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Order #{order.id}
                    </Link>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">{order.items} items</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link
              href="/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 