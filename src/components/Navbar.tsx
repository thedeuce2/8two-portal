'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Navbar() {
  const { state, toggleCart } = useCart();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logos/8twologo.jpg" 
              alt="8TWO" 
              className="w-10 h-10 object-contain"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-white hover:text-gray-300 transition-colors uppercase text-sm tracking-wider">
              Shop
            </Link>
            <Link href="/jersey-designer" className="text-white hover:text-gray-300 transition-colors uppercase text-sm tracking-wider">
              Custom Jerseys
            </Link>
            <Link href="/collections" className="text-white hover:text-gray-300 transition-colors uppercase text-sm tracking-wider">
              Collections
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300 transition-colors uppercase text-sm tracking-wider">
              About
            </Link>
          </div>

          {/* Auth & Cart */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-300 text-sm"
                >
                  {user.name || 'Profile'}
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    setUser(null);
                    window.location.href = '/';
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-white hover:text-gray-300 text-sm"
              >
                Sign in
              </Link>
            )}
            
            <button
              onClick={toggleCart}
              className="relative p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
