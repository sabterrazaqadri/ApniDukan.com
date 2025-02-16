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
  category: {
    name: string;
    slug: {
      current: string;
    };
  };
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ name: string; slug: { current: string } }[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all categories
        const categoriesResult = await client.fetch(
          groq`*[_type == "category"] {
            name,
            "slug": slug.current
          }`
        );
        setCategories(categoriesResult);

        // Fetch all products with their categories
        const result = await client.fetch(
          groq`*[_type == "product"] {
            _id,
            name,
            price,
            description,
            "image": {
              "asset": {
                "url": image.asset->url
              }
            },
            slug,
            "category": category->{
              name,
              "slug": slug
            }
          }`, { caches: 'no-store' }
        );
        
        // Randomly shuffle the products
        const shuffledProducts = [...result].sort(() => Math.random() - 0.5);
        setProducts(shuffledProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category?.slug?.current === selectedCategory);

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
    <div className=" bg-pink-50 mx-auto px-40 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            key="all"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.slug.current)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.slug.current
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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
                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-pink-600 text-white px-2 py-1 rounded-full text-sm">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </div>
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
    </div>
  );
}
