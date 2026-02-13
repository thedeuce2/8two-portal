'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { products, categories } from '@/data/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="bg-[#111] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white font-black text-4xl uppercase tracking-tighter mb-2">
            Shop All
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            {filteredProducts.length} Products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`text-sm uppercase tracking-wider transition-colors ${
                        selectedCategory === 'all'
                          ? 'text-white font-bold'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`text-sm uppercase tracking-wider transition-colors ${
                          selectedCategory === category.id
                            ? 'text-white font-bold'
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-white text-sm uppercase tracking-wider"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
