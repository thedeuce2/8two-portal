'use client';

import React, { useState } from 'react';
import { CustomJerseyConfig, JERSEY_COLORS, JERSEY_FONTS, JERSEY_SIZES, APPROVED_LOGOS, ApprovedLogo, TeamPlayer } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface JerseyControlsProps {
  config: CustomJerseyConfig;
  onConfigChange: (config: CustomJerseyConfig) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  teamPlayers: TeamPlayer[];
  onTeamPlayersChange: (players: TeamPlayer[]) => void;
  isTeamOrder: boolean;
  onTeamOrderChange: (isTeam: boolean) => void;
  onAddToCart: () => void;
  isAdding: boolean;
  price: number;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function JerseyControls({
  config,
  onConfigChange,
  quantity,
  onQuantityChange,
  teamPlayers,
  onTeamPlayersChange,
  isTeamOrder,
  onTeamOrderChange,
  onAddToCart,
  isAdding,
  price,
  selectedSize,
  onSizeChange
}: JerseyControlsProps) {
  
  const updateConfig = (updates: Partial<CustomJerseyConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerSize, setNewPlayerSize] = useState('M');
  const [logoCategory, setLogoCategory] = useState('all');
  const [activeMatrix, setActiveMatrix] = useState<'zones' | 'patterns' | 'decoration' | 'roster'>('zones');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateConfig({ logoImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = () => {
    if (!newPlayerName.trim() || !newPlayerNumber.trim()) return;
    
    const newPlayer: TeamPlayer = {
      id: uuidv4(),
      name: newPlayerName.toUpperCase().slice(0, 15),
      number: newPlayerNumber.replace(/\D/g, '').slice(0, 2),
      size: newPlayerSize,
    };
    
    onTeamPlayersChange([...teamPlayers, newPlayer]);
    setNewPlayerName('');
    setNewPlayerNumber('');
    setNewPlayerSize('M');
  };

  const removePlayer = (id: string) => {
    onTeamPlayersChange(teamPlayers.filter(p => p.id !== id));
  };

  const filteredLogos = logoCategory === 'all' 
    ? APPROVED_LOGOS 
    : APPROVED_LOGOS.filter(l => l.category === logoCategory);

  const logoCategories = ['all', ...new Set(APPROVED_LOGOS.map(l => l.category))];

  const getTeamQuantity = () => {
    if (isTeamOrder) {
      return teamPlayers.length > 0 ? teamPlayers.length : 1;
    }
    return quantity;
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-8 space-y-12 relative overflow-hidden">
      {/* Decorative scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Production Matrix</h2>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">Momentec-Grade Sublimation Configurator</p>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Serial #8TWO-S-228368</span>
            <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 border border-white/10" />)}
            </div>
        </div>
      </div>

      {/* Primary Matrix Navigation */}
      <div className="flex border-b border-white/10">
        {[
            { id: 'zones', label: 'Color Zones' },
            { id: 'patterns', label: 'Patterns' },
            { id: 'decoration', label: 'Decoration' },
            { id: 'roster', label: 'Roster' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveMatrix(tab.id as any)}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeMatrix === tab.id ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
            >
                {tab.label}
                {activeMatrix === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />}
            </button>
        ))}
      </div>

      {activeMatrix === 'zones' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           {/* Zone Selectors */}
           {[
               { id: 'baseColor', label: 'Main Body (Panel A)' },
               { id: 'sleeveColor', label: 'Sleeves (Panel B)' },
               { id: 'yokeColor', label: 'Shoulders (Panel C)' },
               { id: 'sidePanelColor', label: 'Side Inserts (Panel D)' },
               { id: 'collarColor', label: 'Collar Ribbing' }
           ].map(zone => (
               <div key={zone.id} className="space-y-4">
                   <div className="flex justify-between items-end">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{zone.label}</label>
                       <span className="text-[9px] font-black text-white/20 italic">{(config as any)[zone.id]}</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                       {JERSEY_COLORS.map((color) => (
                           <button
                               key={color.value}
                               onClick={() => updateConfig({ [zone.id]: color.value })}
                               className={`w-8 h-8 rounded-none border transition-all ${
                                   (config as any)[zone.id] === color.value ? 'border-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-white/5 hover:border-white/20'
                               }`}
                               style={{ backgroundColor: color.value }}
                           />
                       ))}
                       <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative">
                           <input 
                               type="color" 
                               value={(config as any)[zone.id]} 
                               onChange={(e) => updateConfig({ [zone.id]: e.target.value })}
                               className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                           />
                       </div>
                   </div>
               </div>
           ))}
        </div>
      )}

      {activeMatrix === 'patterns' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Sublimation Pattern</label>
              <div className="grid grid-cols-3 gap-2">
                 {['none', 'mesh', 'geometric', 'camo'].map(p => (
                    <button
                        key={p}
                        onClick={() => updateConfig({ pattern: p as any })}
                        className={`py-4 text-[10px] font-black uppercase tracking-widest border transition-all ${config.pattern === p ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'}`}
                    >
                        {p}
                    </button>
                 ))}
              </div>
           </div>

           {config.pattern !== 'none' && (
              <>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Pattern Intensity</label>
                    <input
                        type="range" min="0.05" max="0.8" step="0.05"
                        value={config.patternOpacity}
                        onChange={(e) => updateConfig({ patternOpacity: parseFloat(e.target.value) })}
                        className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Pattern Chroma</label>
                    <div className="flex flex-wrap gap-2">
                       {JERSEY_COLORS.slice(0, 8).map((color) => (
                           <button
                               key={color.value}
                               onClick={() => updateConfig({ patternColor: color.value })}
                               className={`w-8 h-8 rounded-none border transition-all ${
                                   config.patternColor === color.value ? 'border-amber-500 scale-110' : 'border-white/5'
                               }`}
                               style={{ backgroundColor: color.value }}
                           />
                       ))}
                    </div>
                 </div>
              </>
           )}
        </div>
      )}

      {activeMatrix === 'decoration' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           {/* Logo Matrix */}
           <div className="space-y-4">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Primary Insignia</label>
              <div className="grid grid-cols-4 gap-2">
                 {filteredLogos.map((logo: ApprovedLogo) => (
                    <button
                        key={logo.id}
                        onClick={() => updateConfig({ logoImage: logo.imageUrl })}
                        className={`aspect-square bg-white/[0.02] border transition-all hover:bg-white/5 flex items-center justify-center p-2 ${
                            config.logoImage === logo.imageUrl ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-white/5'
                        }`}
                    >
                        <div className="text-[8px] font-black text-white/20 uppercase text-center leading-none">{logo.name}</div>
                    </button>
                 ))}
              </div>
           </div>

           {/* Advanced Text Styling */}
           <div className="space-y-8 border-t border-white/5 pt-8">
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Text Formatting</label>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-white/20 uppercase mb-1">Fill</span>
                            <input type="color" value={config.nameColor} onChange={(e) => updateConfig({ nameColor: e.target.value })} className="w-8 h-4 bg-transparent cursor-pointer" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-white/20 uppercase mb-1">Stroke</span>
                            <input type="color" value={config.nameOutlineColor} onChange={(e) => updateConfig({ nameOutlineColor: e.target.value })} className="w-8 h-4 bg-transparent cursor-pointer" />
                        </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-black text-white/20 uppercase">
                        <span>Outline Width</span>
                        <span>{config.nameOutlineWidth}px</span>
                    </div>
                    <input type="range" min="0" max="3" step="0.5" value={config.nameOutlineWidth} onChange={(e) => updateConfig({ nameOutlineWidth: parseFloat(e.target.value), numberOutlineWidth: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Typeface</label>
                    <select
                        value={config.nameFont}
                        onChange={(e) => updateConfig({ nameFont: e.target.value, numberFont: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-3 py-3 text-white text-[10px] font-black uppercase focus:border-amber-500 outline-none"
                    >
                        {JERSEY_FONTS.map((font) => (
                            <option key={font.value} value={font.value} className="bg-black">{font.name}</option>
                        ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Serial Display</label>
                    <div className="flex gap-1">
                        {(['front', 'back', 'both'] as const).map((pos) => (
                            <button
                                key={pos}
                                onClick={() => updateConfig({ numberType: pos })}
                                className={`flex-1 py-3 text-[9px] font-black uppercase transition-all border ${config.numberType === pos ? 'bg-white text-black border-white' : 'bg-white/5 text-white/30 border-white/10'}`}
                            >
                                {pos[0]}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeMatrix === 'roster' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="bg-amber-500/5 border border-amber-500/10 p-6">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-5 h-5 border transition-all flex items-center justify-center ${config.useTeamNames ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-white/20'}`}>
                   {config.useTeamNames && <span className="text-black text-[10px] font-black italic">✓</span>}
                </div>
                <input type="checkbox" checked={config.useTeamNames} onChange={(e) => updateConfig({ useTeamNames: e.target.checked })} className="hidden" />
                <span className="text-xs font-black uppercase tracking-widest text-white/80">Deploy Individual Identifiers</span>
              </label>
           </div>

           <div className="space-y-6">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Unit Assignment</label>
              <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                 <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="NAME" className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic outline-none uppercase" />
                    <input type="text" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(e.target.value)} placeholder="#" className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic outline-none text-center" />
                    <select value={newPlayerSize} onChange={(e) => setNewPlayerSize(e.target.value)} className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[10px] font-black uppercase">
                       {JERSEY_SIZES.map((size) => <option key={size} value={size} className="bg-black">{size}</option>)}
                    </select>
                 </div>
                 <button onClick={addPlayer} disabled={!newPlayerName.trim() || !newPlayerNumber.trim()} className="w-full bg-white text-black py-4 text-[11px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">Add to Roster</button>
              </div>

              {teamPlayers.length > 0 && (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {teamPlayers.map((player) => (
                        <div key={player.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 px-4 py-3 group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="text-amber-500 font-black italic w-6 text-sm">#{player.number}</span>
                                <span className="text-white font-black text-[11px] uppercase italic">{player.name}</span>
                                <span className="text-white/20 text-[9px] font-black uppercase">[{player.size}]</span>
                            </div>
                            <button onClick={() => removePlayer(player.id)} className="text-white/10 hover:text-red-500 transition-colors">✕</button>
                        </div>
                    ))}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Transaction Protocol */}
      <div className="pt-10 border-t border-white/10 relative">
        {!isTeamOrder && activeMatrix !== 'roster' && (
           <div className="mb-8 p-4 bg-white/5 border border-white/10">
              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Unit Scale</label>
              <div className="flex gap-1">
                 {JERSEY_SIZES.map(s => (
                    <button key={s} onClick={() => onSizeChange(s)} className={`flex-1 py-2 text-[9px] font-black transition-all border ${selectedSize === s ? 'bg-white text-black border-white' : 'bg-transparent text-white/20 border-white/5'}`}>{s}</button>
                 ))}
              </div>
           </div>
        )}

        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Projected Total</span>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{getTeamQuantity()} UNITS READY</span>
          </div>
          <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">${(price * getTeamQuantity()).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onAddToCart}
          disabled={isAdding || (isTeamOrder && config.useTeamNames && teamPlayers.length === 0)}
          className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 text-xs uppercase tracking-[0.4em] transition-all disabled:opacity-20 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
        >
          {isAdding ? 'TRANSMITTING...' : 'INITIALIZE PRODUCTION'}
        </button>
      </div>
    </div>
  );
}
