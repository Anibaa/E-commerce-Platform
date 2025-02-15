'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function DashboardLayout({ children, requireAuth = false }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex flex-1 pt-16"> {/* Add padding top to account for fixed header */}
        {/* Admin Sidebar - Desktop */}
        {isAdmin && (
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
} 