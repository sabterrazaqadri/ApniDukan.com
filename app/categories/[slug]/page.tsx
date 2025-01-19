'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  slug: {
    current: string;
  };
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

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const result = await client.fetch(
        groq`*[_type == "product" && category._ref in *[_type == "category" && slug.current == $slug]._id]{
          _id,
          name,
          description,
          price,
          image,
          "slug": slug.current
        }`,
        { slug }
      );

      const categoryDetails = await client.fetch(
        groq`*[_type == "category" && slug.current == $slug][0]{
          name
        }`,
        { slug }
        , {cache:'no-store'}
      );

      setProducts(result);
      setCategory(categoryDetails);
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [slug]);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
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
            Browse our wide range of {category?.name || 'products'} and choose your favorites.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleProductClick(product.slug.current)}
            >
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart functionality here
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
