import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUsers, FiSettings, FiBarChart2, FiPackage, FiLogOut, FiShoppingBag } from 'react-icons/fi';

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { icon: FiUsers, label: 'User Management', href: '/admin/users' },
    { icon: FiPackage, label: 'Products', href: '/admin/products' },
    { icon: FiBarChart2, label: 'Reports', href: '/admin/reports' },
    { icon: FiSettings, label: 'Site Settings', href: '/admin/settings' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen px-4 py-6">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}

        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-green-400"
        >
          <FiShoppingBag className="w-5 h-5" />
          <span>Head to Shop</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-red-400 w-full"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
} 