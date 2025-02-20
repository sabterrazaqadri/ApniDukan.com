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
  const [showNotification, setShowNotification] = useState(false);

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

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

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
    <section className="bg-pink-50 mx-auto lg:px-40 px-6 py-8">
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
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <Link href={`/products/${product.slug.current}`}>
              <div className="relative h-64">
                <Image
                  src={product.image.asset.url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
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
      {showNotification && <CartNotification isOpen={true} onClose={() => setShowNotification(false)} productName={''} />}
    </section>
  );
}
