'use client';

import Link from 'next/link';
import { Category } from '@/types';

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-16 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-white font-black text-4xl uppercase tracking-tighter mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            Find your style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative aspect-square bg-[#111] overflow-hidden graffiti-border"
            >
              {/* Placeholder image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

              {/* Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg uppercase tracking-wider group-hover:scale-105 transition-transform">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
