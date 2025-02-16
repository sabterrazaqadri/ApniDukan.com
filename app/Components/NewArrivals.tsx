'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { groq } from 'next-sanity';
import client from '@/sanity/lib/client';
import { useCart } from '../context/CartContext';

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
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-40 mx-auto p-4 bg-pink-50">
      <div className="mb-8 ">
        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
        <p className="text-gray-600 mt-2">Check out our latest products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/products/${product.slug.current}`}>
              <div className="relative h-64 w-full">
                <Image
                  src={product.image.asset.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/products/${product.slug.current}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-pink-600">
                  Rs{product.price}
                </span>
                <button
                  onClick={() => addToCart({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image.asset.url,
                  }, 1)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
