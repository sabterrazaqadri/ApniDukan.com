/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Image from 'next/image';

const Card = async () => {
    
    const products = await client.fetch(groq`*[_type=="product"]`,{ caches: 'no-store' }) 
        

    return (
        <div className="max-w-8xl mx-auto px-4 flex justify-center sm:px-6 lg:px-8 py-12 bg-pink-50">
            <div className=' w-10/12'>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Our Products
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <div key={product.id || product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Product Image */}
                        <div className="relative h-48 w-full">
                            <Image
                                src={urlFor(product.image).url()}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300 p-5"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                    {product.name}
                                </h3>
                                <span className="text-lg font-bold text-pink-600">
                                    Rs{product.price.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 tracking-wider">
                                {product.description}
                            </p>
                            <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
                </div>
                </div>
        </div>
    );
};

export default Card;
