'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await client.fetch<Product>(
          groq`*[_type == "product" && slug.current == $slug][0]{
            _id,
            name,
            description,
            price,
            image,
            ingredients,
            nutritionalInfo,
            allergens
          }`,
          { slug: params.slug }
        );

        if (!result) {
          setError(true);
        } else {
          setProduct(result);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <p className="text-xl text-gray-600">
          Sorry, the product you're looking for could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src={urlFor(product.image).url()}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-pink-600 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-8">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  className="px-4 py-2 text-pink-600 hover:bg-pink-50"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  className="px-4 py-2 text-pink-600 hover:bg-pink-50"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors mb-8"
              onClick={() => alert(`Added ${quantity} of ${product.name} to cart!`)}
            >
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>

            {/* Additional Information */}
            <div className="space-y-6">
              {product.ingredients && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ingredients
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.nutritionalInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nutritional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-gray-600">
                    {product.nutritionalInfo.calories && (
                      <div>Calories: {product.nutritionalInfo.calories}kcal</div>
                    )}
                    {product.nutritionalInfo.protein && (
                      <div>Protein: {product.nutritionalInfo.protein}g</div>
                    )}
                    {product.nutritionalInfo.carbs && (
                      <div>Carbs: {product.nutritionalInfo.carbs}g</div>
                    )}
                    {product.nutritionalInfo.fat && (
                      <div>Fat: {product.nutritionalInfo.fat}g</div>
                    )}
                  </div>
                </div>
              )}

              {product.allergens && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Allergen Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {product.allergens.map((allergen, index) => (
                      <li key={index}>{allergen}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
