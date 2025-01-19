'use client';

import { useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

const FeaturedCategories = async () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const categories = await client.fetch(groq`*[_type=="category"]`,{ caches: 'no-store' })

    const itemsToShow = 6; // Number of items to show at once
    const totalPages = Math.ceil(categories.length / itemsToShow);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const getCurrentCategories = () => {
        const start = currentIndex * itemsToShow;
        return categories.slice(start, start + itemsToShow);
    };

    return (
        <div className='w-full h-full bg-pink-50'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-pink-50">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Featured Categories
            </h2>

            <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-pink-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Categories */}
                <div className="overflow-hidden">
                    <div 
                        className="flex px-10 gap-6 transition-transform duration-500"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / totalPages)}%)`
                        }}
                    >
                        {getCurrentCategories().map((category : any) => (
                            <div 
                                key={category.id} 
                                className="flex-none w-[calc(100%/6-1rem)] group cursor-pointer"
                            >
                            <Link href={`/categories/${category.slug.current}`}>
  <div className="relative aspect-square rounded-full overflow-hidden mb-3 border-2 border-pink-200 group-hover:border-pink-500 transition-colors">
    <Image
      src={urlFor(category.image).url()}
      alt={category.name}
      fill
      className="object-cover group-hover:scale-110 transition-transform duration-300"
      sizes="(max-width: 768px) 33vw, 16vw"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
</Link>

                                <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                                    {category.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={nextSlide}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-pink-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Dots Navigation */}
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
            </div>
            </div>
    );
};

export default FeaturedCategories;
