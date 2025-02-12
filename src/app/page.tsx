import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 199.99,
    image: '/images/headphones.jpg',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Stylish Watch',
    price: 299.99,
    image: '/images/watch.jpg',
    category: 'Accessories',
  },
  // Add more featured products as needed
];

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
  return (
    <DashboardLayout requireAuth={false}>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to EcommStore
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Discover amazing products at great prices
            </p>
            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{product.category}</p>
                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </p>
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-white mt-2">
                        {category.itemCount} Products
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
