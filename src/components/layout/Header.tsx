'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHeart } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ user, onLogout, onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const cart = await response.json();
        const totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemsCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    // Initial count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdate', updateCartCount);
    
    // Listen for scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cartUpdate', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              EcommStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Deals
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-full text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <FiHeart className="w-6 h-6" />
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 group"
            >
              <FiShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors">
                  <FiUser className="w-6 h-6" />
                  <span className="font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Cart ({cartItemsCount})
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 