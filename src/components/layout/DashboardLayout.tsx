'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (requireAuth && (!storedUser || !token)) {
      router.push('/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [requireAuth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {user && <Sidebar />}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 