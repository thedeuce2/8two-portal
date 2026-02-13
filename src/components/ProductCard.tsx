'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, quantity, selectedSize);
    }
  };

  return (
    <div className="group relative bg-[#111] graffiti-border overflow-hidden">
      {/* Image Placeholder */}
      <div className="aspect-[3/4] image-placeholder relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/logos/8twologo.jpg" 
              alt="8TWO" 
              className="w-24 h-24 object-contain opacity-50"
            />
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Size selector */}
        {product.sizes && product.inStock && (
          <div className="flex gap-2 mb-3">
            {product.sizes.slice(0, 5).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-8 h-8 text-xs font-bold border transition-colors ${
                  selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'text-white border-gray-600 hover:border-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-xl">${product.price.toFixed(2)}</span>
          {product.sizes && (
            <span className="text-gray-500 text-xs uppercase">
              {product.sizes.length} sizes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
