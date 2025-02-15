'use client'
import { useRouter } from 'next/navigation';
import { FiX } from 'react-icons/fi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginModal({ isOpen, onClose, message = "Please log in to continue" }: LoginModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Sign in to EcommStore
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  router.push('/login');
                  onClose();
                }}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => {
                    router.push('/register');
                    onClose();
                }
                }
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 