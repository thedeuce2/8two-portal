'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <section className="py-16">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-white font-black text-4xl uppercase tracking-tighter mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-500 uppercase tracking-widest text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
