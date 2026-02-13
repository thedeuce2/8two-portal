'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  colors: string[];
  memberCount: number;
}

interface TeamShopClientProps {
  team: Team;
  products: Product[];
}

export default function TeamShopClient({ team, products }: TeamShopClientProps) {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    addItem(
      selectedProduct,
      quantity,
      selectedSize || selectedProduct.sizes?.[0],
      selectedColor || selectedProduct.colors?.[0]
    );
    
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      setSelectedProduct(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Team Header Banner */}
      <div 
        className="relative py-16 px-6 border-b"
        style={{ 
          background: `linear-gradient(135deg, ${team.colors[0]}22 0%, ${team.colors[1] || team.colors[0]}11 100%)`,
          borderColor: `${team.colors[0]}44`
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Team Logo */}
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-24 h-24 mx-auto mb-4 rounded-lg" />
          ) : (
            <div 
              className="w-24 h-24 mx-auto mb-4 rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{ 
                backgroundColor: team.colors[0],
                color: team.colors[1] || '#000'
              }}
            >
              {team.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {team.name}
          </h1>
          {team.description && (
            <p className="text-gray-400 max-w-md mx-auto">{team.description}</p>
          )}
          <p className="text-gray-500 text-sm mt-4">
            {team.memberCount} members • Team Store
          </p>
        </div>
        
        {/* Back link */}
        <Link 
          href="/profile"
          className="absolute left-6 top-6 text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back to Profile
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setSelectedSize(product.sizes?.[0] || '');
                setSelectedColor(product.colors?.[0] || '');
              }}
              className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition-colors text-left"
            >
              {/* Product Image Placeholder */}
              <div 
                className="aspect-square relative"
                style={{ 
                  background: product.colors?.[0] 
                    ? `linear-gradient(135deg, ${product.colors[0]} 0%, ${product.colors[0]}88 100%)`
                    : 'linear-gradient(135deg, #333 0%, #222 100%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/logos/8twologo.jpg" 
                    alt="8TWO" 
                    className="w-16 h-16 object-contain opacity-30"
                  />
                </div>
                {/* Quick add indicator */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold">View</span>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-white font-bold mt-2">${product.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found in this category</p>
          </div>
        )}
      </main>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setSelectedProduct(null)}
          />
          
          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
            <div className="bg-zinc-900 rounded-2xl p-6 mx-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                  <p className="text-2xl font-bold text-white mt-1">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Size Selection */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                          selectedSize === size
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-zinc-800 text-white rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-zinc-800 text-white rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize && !selectedProduct.sizes?.[0]}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Team badge */}
              <div 
                className="mt-4 py-2 px-4 rounded-full text-center text-sm font-medium"
                style={{ 
                  backgroundColor: `${team.colors[0]}33`,
                  color: team.colors[0]
                }}
              >
                Team member price applied
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 8TWO Streetwear. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
