/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import client from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import CartNotification from '@/app/Components/CartNotification';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  slug: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
}

interface Category {
  name: string;
}

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setShowNotification(true);
    setAddedProduct(product);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const result = await client.fetch(
          groq`*[_type == "product" && category._ref in *[_type == "category" && slug.current == $slug]._id]{
            _id,
            name,
            description,
            price,
            image,
            "slug": slug.current,
            ingredients,
            nutritionalInfo,
            allergens
          }`,
          { slug }
        );

        const categoryDetails = await client.fetch(
          groq`*[_type == "category" && slug.current == $slug][0]{
            name
          }`,
          { slug }
        );

        setProducts(result);
        setCategory(categoryDetails);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const handleProductClick = (productSlug: string) => {
    console.log('Clicking product with slug:', productSlug);
    router.push(`/products/${productSlug}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category?.name || 'Category'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of {category?.name.toLowerCase() || 'products'} and choose your favorites.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-64">
                  <Image
                    src={urlFor(product.image).url()}
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

        {showNotification && <CartNotification isOpen={true} onClose={() => setShowNotification(false)} productName={addedProduct?.name || 'Product'} />}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}