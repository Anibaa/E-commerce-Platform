'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useAuthModal } from '@/context/AuthModalContext';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showLoginModal } = useAuthModal();

  const handleAuthRequired = () => {
    showLoginModal('Please log in to view and manage your shopping cart');
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthRequired();
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthRequired();
          return;
        }
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener('cartUpdate', fetchCart);
    return () => window.removeEventListener('cartUpdate', fetchCart);
  }, []);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthRequired();
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthRequired();
          return;
        }
        throw new Error('Failed to update cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthRequired();
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthRequired();
          return;
        }
        throw new Error('Failed to remove item');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(cart?.items.map(item => 
        removeItem(item.product._id)
      ) || []);
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const subtotal = cart?.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0) || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart && cart.items && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart?.items.length ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Your cart is empty</div>
            <Link
              href="/products"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white shadow-sm rounded-lg">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center p-6 border-b border-gray-200 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/products/${item.product._id}`} className="hover:text-indigo-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/products"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Shipping Notice */}
              {subtotal < 100 && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    Add ${(100 - subtotal).toFixed(2)} more to your cart to qualify for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 