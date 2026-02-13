'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { CustomJerseyConfig, TeamPlayer } from '@/types';
import { products } from '@/data/products';

const CUSTOM_JERSEY_PRODUCT = products.find(p => p.id === 'custom-jersey')!;

// Dynamic import for preview to avoid SSR issues
const JerseyPreview = dynamic(() => import('@/components/JerseyPreview'), { 
  ssr: false,
  loading: () => (
    <div className="bg-zinc-900 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '500px' }}>
      <div className="text-gray-400">Loading preview...</div>
    </div>
  )
});

const JerseyControls = dynamic(() => import('@/components/JerseyControls'), { 
  ssr: false 
});

const defaultConfig: CustomJerseyConfig = {
  baseColor: '#1a1a1a',
  trimColor: '#ffffff',
  logoPosition: { x: 50, y: 35 },
  logoScale: 1,
  name: '',
  nameFont: 'Arial Black, sans-serif',
  nameColor: '#ffffff',
  number: '',
  numberFont: 'Impact, sans-serif',
  numberColor: '#ffffff',
  numberPosition: 'front',
  useTeamNames: false,
};

export default function JerseyDesignerPage() {
  const { addItem } = useCart();
  const [config, setConfig] = useState<CustomJerseyConfig>(defaultConfig);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdding, setIsAdding] = useState(false);
  
  // Team order state
  const [isTeamOrder, setIsTeamOrder] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayer[]>([]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);

  // Get current player for preview
  const currentPlayer = useMemo(() => {
    if (isTeamOrder && config.useTeamNames && teamPlayers.length > 0) {
      return teamPlayers[selectedPlayerIndex];
    }
    return null;
  }, [isTeamOrder, config.useTeamNames, teamPlayers, selectedPlayerIndex]);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    if (isTeamOrder && config.useTeamNames) {
      // Add each player as a separate cart item
      teamPlayers.forEach((player) => {
        const playerConfig: CustomJerseyConfig = {
          ...config,
          name: player.name,
          number: player.number,
          useTeamNames: true,
        };
        
        addItem(
          CUSTOM_JERSEY_PRODUCT,
          1,
          player.size,
          config.baseColor,
          playerConfig
        );
      });
    } else {
      // Single order
      addItem(
        CUSTOM_JERSEY_PRODUCT,
        quantity,
        selectedSize,
        config.baseColor,
        config
      );
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-black tracking-tighter text-white">
            8TWO
          </a>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="/shop" className="text-gray-400 hover:text-white transition-colors">SHOP</a>
            <a href="/collections" className="text-gray-400 hover:text-white transition-colors">COLLECTIONS</a>
            <a href="/jersey-designer" className="text-white">CUSTOM JERSEYS</a>
            <a href="/about" className="text-gray-400 hover:text-white transition-colors">ABOUT</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">CUSTOM JERSEY DESIGNER</h1>
          <p className="text-gray-400">
            {isTeamOrder 
              ? 'Design once, customize for your entire team. Add each player with their name and number.' 
              : 'Create your unique jersey with custom colors, logo, name, and number.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Preview Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Preview</h2>
              
              {/* Player selector for team orders */}
              {isTeamOrder && config.useTeamNames && teamPlayers.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPlayerIndex(Math.max(0, selectedPlayerIndex - 1))}
                    disabled={selectedPlayerIndex === 0}
                    className="w-8 h-8 bg-zinc-800 text-white rounded disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <span className="text-white text-sm">
                    {teamPlayers[selectedPlayerIndex].name} #{teamPlayers[selectedPlayerIndex].number}
                  </span>
                  <button
                    onClick={() => setSelectedPlayerIndex(Math.min(teamPlayers.length - 1, selectedPlayerIndex + 1))}
                    disabled={selectedPlayerIndex === teamPlayers.length - 1}
                    className="w-8 h-8 bg-zinc-800 text-white rounded disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
            
            <JerseyPreview 
              config={config} 
              size={selectedSize}
              playerName={currentPlayer?.name}
              playerNumber={currentPlayer?.number}
              previewOnly={isTeamOrder && config.useTeamNames}
            />
            
            {/* Size Selector for Preview */}
            <div className="mt-4 flex justify-center gap-2">
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {/* Quick Stats for Team Orders */}
            {isTeamOrder && teamPlayers.length > 0 && (
              <div className="mt-4 bg-zinc-900 rounded-lg p-4">
                <h3 className="text-white font-bold text-sm mb-2">Team Roster ({teamPlayers.length} players)</h3>
                <div className="flex flex-wrap gap-2">
                  {teamPlayers.map((player, idx) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerIndex(idx)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedPlayerIndex === idx
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 text-gray-300'
                      }`}
                    >
                      {player.name} #{player.number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <JerseyControls
            config={config}
            onConfigChange={setConfig}
            quantity={quantity}
            onQuantityChange={setQuantity}
            teamPlayers={teamPlayers}
            onTeamPlayersChange={setTeamPlayers}
            isTeamOrder={isTeamOrder}
            onTeamOrderChange={setIsTeamOrder}
            onAddToCart={handleAddToCart}
            isAdding={isAdding}
            price={CUSTOM_JERSEY_PRODUCT.price}
          />
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Premium Quality</h3>
            <p className="text-gray-500 text-xs">Heavyweight cotton with durable prints.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Team Orders</h3>
            <p className="text-gray-500 text-xs">Bulk orders with individual customization.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Fast Turnaround</h3>
            <p className="text-gray-500 text-xs">Ships within 3-5 business days.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Admin Logos</h3>
            <p className="text-gray-500 text-xs">Curated logos for quality assurance.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 8TWO Streetwear. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
