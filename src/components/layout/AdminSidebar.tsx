'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiGrid,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiSettings,
  FiBarChart2,
  FiList,
  FiTag,
  FiMessageSquare,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    path: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: <FiGrid className="w-5 h-5" />,
  },
  {
    title: 'Products',
    icon: <FiBox className="w-5 h-5" />,
    submenu: [
      { title: 'All Products', path: '/admin/products' },
      { title: 'Add Product', path: '/admin/products/add' },
      { title: 'Categories', path: '/admin/products/categories' },
    ],
  },
  {
    title: 'Users',
    icon: <FiUsers className="w-5 h-5" />,
    submenu: [
      { title: 'All Users', path: '/admin/users' },
      { title: 'Add User', path: '/admin/users/add' },
      { title: 'User Roles', path: '/admin/users/roles' },
    ],
  },
  {
    title: 'Newsletter',
    path: '/admin/newsletter',
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: <FiSettings className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isSubmenuOpen = (title: string) => openMenus.includes(title);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 pt-16">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex-1 py-4 px-3">
          {menuItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.submenu ? (
                // Menu item with submenu
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                      ${isSubmenuOpen(item.title)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {isSubmenuOpen(item.title) ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {/* Submenu */}
                  {isSubmenuOpen(item.title) && (
                    <div className="mt-1 ml-4 pl-4 border-l border-gray-200">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                            isActive(subitem.path)
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular menu item
                <Link
                  href={item.path!}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path!)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Admin Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 