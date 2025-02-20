'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { groq } from 'next-sanity';
import client from '@/sanity/lib/client';
import { useCart } from '../context/CartContext';
import CartNotification from '@/app/Components/CartNotification';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 3000);
  };

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const result = await client.fetch(
          groq`*[_type == "product"] | order(_createdAt desc)[0...6] {
            _id,
            name,
            price,
            description,
            "image": {
              "asset": {
                "url": image.asset->url
              }
            },
            slug
          }`, { caches: 'no-store' }
        );
        setProducts(result);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className={`lg:px-40 mx-auto p-4 bg-pink-50`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:px-40 mx-auto p-6 bg-pink-50">
      <div className="mb-8 ">
        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
        <p className="text-gray-600 mt-2">Check out our latest products</p>
        <Link href="/products" className="inline-block mt-2 text-pink-600 text-sm font-medium hover:underline">View All</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <Link href={`/products/${product.slug.current}`}>
              <div className="relative h-64">
                <Image
                  src={product.image.asset.url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-600">Rs{product.price.toFixed(2)}</span>
                  <button
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {notificationVisible && <CartNotification isOpen={true} onClose={() => setNotificationVisible(false)} productName={''} />}
    </section>
  );
}
