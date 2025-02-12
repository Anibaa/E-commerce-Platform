'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/orders', label: 'My Orders', icon: '📦' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: '🎛️' },
    { href: '/admin/products', label: 'Manage Products', icon: '📝' },
    { href: '/admin/orders', label: 'Manage Orders', icon: '📦' },
    { href: '/admin/users', label: 'Manage Users', icon: '👥' },
    { href: '/admin/categories', label: 'Categories', icon: '📑' },
  ];

  const links = user?.role === 'admin' ? [...userLinks, ...adminLinks] : userLinks;

  if (!user) return null;

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 