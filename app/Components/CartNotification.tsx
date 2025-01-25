'use client';

import { useRouter } from 'next/navigation';

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const CartNotification = ({ isOpen, onClose, productName }: CartNotificationProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewCart = () => {
    router.push('/cart');
    onClose();
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Message */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Item Added to Cart!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            You've added {productName} to your cart
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleViewCart}
              className="w-full sm:w-auto px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
