'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';

interface User {
  name: string;
  email: string;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function DashboardLayout({ children, requireAuth = false }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (requireAuth) {
      router.push('/login');
    }
  }, [requireAuth, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
          <Link href="/" className="text-xl font-bold text-indigo-600">
            EcommStore
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ) : (
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b">
          <nav className="px-4 py-2 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Shop</span>
            </Link>
            {user && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-red-600 w-full"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Admin Sidebar - Desktop */}
        {isAdmin && (
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  EcommStore
                </Link>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 