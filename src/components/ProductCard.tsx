import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showLoginModal } = useAuthModal();

  const addToCart = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showLoginModal('Please log in to add items to your cart');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          showLoginModal('Please log in to add items to your cart');
          return;
        }
        throw new Error('Failed to add to cart');
      }

      // Show success message using toast
      toast.success('Product added to cart!', {
        icon: '🛍️',
      });
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={addToCart}
            disabled={isLoading || product.stock === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : isLoading
                ? 'bg-indigo-400 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : isLoading
              ? 'Adding...'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
} 