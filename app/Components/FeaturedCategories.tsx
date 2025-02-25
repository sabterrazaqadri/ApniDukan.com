/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import client from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image: any;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsToShow = 6; // Fixed 6 items per view
  const totalPages = Math.ceil(categories.length / itemsToShow);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = groq`*[_type == "category"] {
          _id,
          name,
          slug,
          image
        }`;
        const data = await client.fetch(query);
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex >= totalPages ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? totalPages - 1 : prevIndex;
    });
  };

  const getCurrentCategories = () => {
    const start = currentIndex * itemsToShow;
    return categories.slice(start, start + itemsToShow);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-pink-50 py-12" id='menu'>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Featured Categories
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {getCurrentCategories().map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug.current}`}
                  className="group"
                >
                  <div className="aspect-square relative rounded-full overflow-hidden mb-3 border-2 border-pink-200 group-hover:border-pink-500 transition-colors">
                    <Image
                      src={urlFor(category.image).url()}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {categories.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-pink-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-pink-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-pink-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-pink-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-pink-600' : 'bg-pink-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCategories;