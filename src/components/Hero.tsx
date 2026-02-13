'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Spray texture overlay */}
      <div className="absolute inset-0 spray-texture pointer-events-none" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Big logo */}
        <div className="mb-8">
          <img 
            src="/logos/8twologo.jpg" 
            alt="8TWO Streetwear" 
            className="w-48 h-48 mx-auto object-contain"
          />
        </div>

        {/* Tagline removed - logo speaks for itself */}

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 uppercase tracking-widest">
          Premium apparel for those who don't follow the crowd
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors graffiti-border"
          >
            Shop Now
          </Link>
          <Link
            href="/collections"
            className="border border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            View Collections
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16">
          <div className="text-center">
            <div className="text-white font-bold text-3xl">8TWO</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Since 2024</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-3xl">50+</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Products</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-3xl">∞</div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Style</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
