import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategorySection from '@/components/CategorySection';
import { products, categories } from '@/data/products';

export default function Home() {
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="bg-[#0a0a0a]">
      {/* Hero Section */}
      <Hero />

      {/* Category Section */}
      <CategorySection categories={categories} />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid
          products={featuredProducts}
          title="Featured Products"
          subtitle="Our most popular items"
        />
      </section>

      {/* Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#111] graffiti-border overflow-hidden">
            {/* Spray texture */}
            <div className="absolute inset-0 spray-texture pointer-events-none" />
            
            <div className="relative z-10 px-8 py-12 md:py-16 md:px-16 text-center">
              <h2 className="text-white font-black text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                Join the Movement
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Sign up for our newsletter and get 10% off your first order.
                Plus exclusive access to new drops and limited editions.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[#0a0a0a] border border-[#333] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh styles just dropped"
        />
      </section>
    </div>
  );
}
