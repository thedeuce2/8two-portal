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
    <div className="bg-zinc-900 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '600px' }}>
      <div className="text-gray-400">Loading projection system...</div>
    </div>
  )
});

const JerseyControls = dynamic(() => import('@/components/JerseyControls'), { 
  ssr: false 
});

const defaultConfig: CustomJerseyConfig = {
  baseColor: '#1a1a1a',
  sleeveColor: '#1a1a1a',
  collarColor: '#ffffff',
  sidePanelColor: '#1a1a1a',
  yokeColor: '#1a1a1a',
  
  pattern: 'none',
  patternColor: '#ffffff',
  patternOpacity: 0.1,

  logoPosition: { x: 50, y: 35 },
  logoScale: 1,
  
  name: '',
  namePosition: { y: 20 },
  nameScale: 1,
  nameFont: 'Arial Black, sans-serif',
  nameColor: '#ffffff',
  nameOutlineColor: '#000000',
  nameOutlineWidth: 0,

  teamName: '',
  teamNamePosition: { y: 25 },
  teamNameScale: 1,
  teamNameOutlineColor: '#000000',

  number: '',
  numberPosition: { y: 50 },
  numberScale: 1,
  numberFont: 'Impact, sans-serif',
  numberColor: '#ffffff',
  numberOutlineColor: '#000000',
  numberOutlineWidth: 0,
  numberType: 'back',

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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Cinematic Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_90%,_rgba(255,255,255,0.02)_0%,_transparent_40%)]" />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-12 border-b border-white/5 pb-8">
          <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Professional Grade</p>
          <h1 className="text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">Sublimation <span className="text-white/20">Studio</span></h1>
          <p className="text-zinc-500 max-w-2xl font-medium leading-relaxed">
            {isTeamOrder 
              ? 'Multi-zone fleet deployment. Sublimated patterns and individual serialized roster assignment.' 
              : 'Precision unit configurator. Access multi-layer color zones and advanced fabric patterns.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-amber-500 animate-pulse" />
                 <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Projection Matrix v3.0</h2>
              </div>
              
              {/* Player selector for team orders */}
              {isTeamOrder && config.useTeamNames && teamPlayers.length > 0 && (
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                  <button
                    onClick={() => setSelectedPlayerIndex(Math.max(0, selectedPlayerIndex - 1))}
                    disabled={selectedPlayerIndex === 0}
                    className="text-white hover:text-amber-500 disabled:opacity-20 transition-colors"
                  >
                    PREV
                  </button>
                  <div className="text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-white/30 uppercase leading-none mb-1">UNIT</p>
                    <p className="text-sm font-black italic uppercase">
                      {teamPlayers[selectedPlayerIndex].name} #{teamPlayers[selectedPlayerIndex].number}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPlayerIndex(Math.min(teamPlayers.length - 1, selectedPlayerIndex + 1))}
                    disabled={selectedPlayerIndex === teamPlayers.length - 1}
                    className="text-white hover:text-amber-500 disabled:opacity-20 transition-colors"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative group">
              {/* Decorative corners */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-500/50 z-20" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-500/50 z-20" />
              
              <div className="bg-[#0a0a0a] border border-white/5 shadow-2xl transition-all group-hover:border-white/10">
                <JerseyPreview 
                  config={config} 
                  size={selectedSize}
                  playerName={currentPlayer?.name}
                  playerNumber={currentPlayer?.number}
                  previewOnly={isTeamOrder && config.useTeamNames}
                  onConfigChange={(updates) => setConfig({ ...config, ...updates })}
                />
              </div>
            </div>
            
            {/* Quick Stats for Team Orders */}
            {isTeamOrder && teamPlayers.length > 0 && (
              <div className="bg-white/5 border border-white/5 p-6">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Roster Manifest</h3>
                  <span className="text-[10px] font-black text-amber-500">{teamPlayers.length} / 50</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teamPlayers.map((player, idx) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerIndex(idx)}
                      className={`px-3 py-2 text-[10px] font-black rounded transition-all border text-left truncate ${
                        selectedPlayerIndex === idx
                          ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                          : 'bg-white/5 text-white/30 border-white/5 hover:border-white/10'
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
          <div className="relative">
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
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />
          </div>
        </div>

        {/* Features - High Tech Footer Style */}
        <div className="mt-32 grid md:grid-cols-4 gap-8 border-t border-white/5 pt-16">
          {[
            { title: 'Full Sublimation', desc: 'Colors and patterns are printed directly into the fabric fibers for zero-fade performance.' },
            { title: 'Fleet Logistics', desc: 'Automated roster processing for team-scale deployment.' },
            { title: 'Rapid Execution', desc: 'Accelerated production cycle with 72-hour turnaround.' },
            { title: 'Verified Assets', desc: 'Quality-controlled vector processing for all uploaded identifiers.' }
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-amber-500/40">0{i+1}</span>
                 <h3 className="font-black text-white text-[11px] uppercase tracking-widest">{feature.title}</h3>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">8TWO STRATEGIC APPAREL</div>
           <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
            © 2026 8TWO ENTERPRISE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
