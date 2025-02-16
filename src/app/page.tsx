'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/ProductCard';
import { FiArrowRight, FiStar, FiTruck, FiLock, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: '/images/electronics.jpg',
    itemCount: 150,
  },
  {
    id: 2,
    name: 'Clothing',
    image: '/images/clothing.jpg',
    itemCount: 300,
  },
  // Add more categories as needed
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // If user is admin, handle accordingly
      if (parsedUser.role === 'admin') {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        router.push('/login');
        return;
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        // Filter featured products
        const featured = data.filter((product: Product) => product.featured);
        setFeaturedProducts(featured.slice(0, 4));
        
        // Get latest products
        const sorted = [...data].sort((a: Product, b: Product) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNewArrivals(sorted.slice(0, 4));
      } catch (error) {
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/hero-image.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover Your Perfect Style
            </h1>
            <p className="text-xl mb-8">
              Shop the latest trends in fashion with our curated collection of premium products.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Shop Now
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <FiTruck className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Free Shipping</h3>
                <p className="text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <FiLock className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Payment</h3>
                <p className="text-gray-600">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0">
                <FiRefreshCw className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Easy Returns</h3>
                <p className="text-gray-600">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600">Handpicked by our experts</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              View All
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="mt-2 text-gray-600">The latest additions to our collection</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              View All
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
