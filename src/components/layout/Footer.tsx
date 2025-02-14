import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiInstagram, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscriptionStatus('loading');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      setSubscriptionStatus('success');
      setEmail('');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    } catch (error) {
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-8 border-b">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Stay updated with our latest products and exclusive offers
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                {subscriptionStatus === 'success' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                    Subscribed!
                  </span>
                )}
                {subscriptionStatus === 'error' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                    Failed to subscribe
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={subscriptionStatus === 'loading'}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors inline-flex items-center"
              >
                {subscriptionStatus === 'loading' ? (
                  'Subscribing...'
                ) : (
                  <>
                    Subscribe
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-indigo-600">
                EcommStore
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Curating quality products for your lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Shop</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center text-sm text-gray-500">
                <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                support@example.com
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                (555) 123-4567
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                123 Commerce St
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} EcommStore. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
              aria-label="Instagram"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 