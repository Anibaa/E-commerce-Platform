import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const addToCart = async () => {
    setIsLoading(true);
    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item._id === product._id
      );

      if (existingItemIndex > -1) {
        // Increment quantity if product exists
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new product with quantity 1
        existingCart.push({ ...product, quantity: 1 });
      }

      // Save updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));

      // Show success message
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
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