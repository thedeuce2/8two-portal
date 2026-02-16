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
  const [activeMatrix, setActiveMatrix] = useState<'components' | 'identity' | 'graphics' | 'roster'>('components');

  const addPlayer = () => {
    if (!newPlayerName.trim() || !newPlayerNumber.trim()) return;
    onTeamPlayersChange([...teamPlayers, { id: uuidv4(), name: newPlayerName.toUpperCase().slice(0, 15), number: newPlayerNumber.replace(/\D/g, '').slice(0, 2), size: newPlayerSize }]);
    setNewPlayerName(''); setNewPlayerNumber('');
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-8 space-y-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Production Matrix</h2>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-[9px] font-black text-amber-500/80 uppercase tracking-[0.3em]">8TWO Strategic Industrial Suite</p>
            </div>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Matrix Status</span>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">ONLINE // SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 border border-white/10">
        {[ { id: 'components', label: 'Modular' }, { id: 'identity', label: 'Identity' }, { id: 'graphics', label: 'Graphics' }, { id: 'roster', label: 'Fleet' } ].map(tab => (
            <button key={tab.id} onClick={() => setActiveMatrix(tab.id as any)} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeMatrix === tab.id ? 'bg-white text-black' : 'text-white/20 hover:text-white/40'}`}>
                {tab.label}
            </button>
        ))}
      </div>

      {activeMatrix === 'components' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           {/* BODY COMPONENT */}
           <div className="space-y-4">
               <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Base Chassis (Body)</label>
                   <div className="flex items-center gap-4">
                       <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.bodyOpacity ?? 1) * 100)}%</span>
                       <button onClick={() => updateConfig({ showBody: !config.showBody })} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${config.showBody ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>{config.showBody ? 'Equipped' : 'Removed'}</button>
                   </div>
               </div>
               <div className="flex flex-wrap gap-2">
                   {JERSEY_COLORS.map(c => (
                       <button key={c.value} onClick={() => updateConfig({ bodyColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.bodyColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`} style={{ backgroundColor: c.value }} title={c.name} />
                   ))}
               </div>
               <input type="range" min="0" max="1" step="0.05" value={config.bodyOpacity ?? 1} onChange={(e) => updateConfig({ bodyOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>

           {/* SLEEVE COMPONENT */}
           <div className="space-y-4 pt-6 border-t border-white/5">
               <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Hydraulic Sleeves</label>
                   <div className="flex items-center gap-4">
                       <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.sleeveOpacity ?? 1) * 100)}%</span>
                       <button onClick={() => updateConfig({ showSleeves: !config.showSleeves })} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${config.showSleeves ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>{config.showSleeves ? 'Equipped' : 'Removed'}</button>
                   </div>
               </div>
               <div className="flex flex-wrap gap-2">
                   {JERSEY_COLORS.map(c => (
                       <button key={c.value} onClick={() => updateConfig({ sleeveColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.sleeveColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`} style={{ backgroundColor: c.value }} title={c.name} />
                   ))}
               </div>
               <input type="range" min="0" max="1" step="0.05" value={config.sleeveOpacity ?? 1} onChange={(e) => updateConfig({ sleeveOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>

           {/* COLLAR COMPONENT */}
           <div className="space-y-4 pt-6 border-t border-white/5">
               <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Neck (Collar)</label>
                   <div className="flex items-center gap-4">
                       <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.collarOpacity ?? 1) * 100)}%</span>
                       <button onClick={() => updateConfig({ showCollar: !config.showCollar })} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${config.showCollar ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>{config.showCollar ? 'Equipped' : 'Removed'}</button>
                   </div>
               </div>
               <div className="flex flex-wrap gap-2">
                   {JERSEY_COLORS.map(c => (
                       <button key={c.value} onClick={() => updateConfig({ collarColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.collarColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`} style={{ backgroundColor: c.value }} title={c.name} />
                   ))}
               </div>
               <input type="range" min="0" max="1" step="0.05" value={config.collarOpacity ?? 1} onChange={(e) => updateConfig({ collarOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>

           {/* DESIGN 1 (STRIPES) */}
           <div className="space-y-4 pt-6 border-t border-white/5">
               <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Dorsal Stripes (V1)</label>
                   <div className="flex items-center gap-4">
                       <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.design1Opacity ?? 0.5) * 100)}%</span>
                       <button onClick={() => updateConfig({ showDesign1: !config.showDesign1 })} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${config.showDesign1 ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>{config.showDesign1 ? 'Active' : 'Offline'}</button>
                   </div>
               </div>
               <div className="flex flex-wrap gap-2">
                   {JERSEY_COLORS.map(c => (
                       <button key={c.value} onClick={() => updateConfig({ design1Color: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.design1Color === c.value ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`} style={{ backgroundColor: c.value }} title={c.name} />
                   ))}
               </div>
               <input type="range" min="0" max="1" step="0.05" value={config.design1Opacity ?? 0.5} onChange={(e) => updateConfig({ design1Opacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>

           {/* DESIGN 2 (SHOULDER) */}
           <div className="space-y-4 pt-6 border-t border-white/5">
               <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Apex Overlays (V2)</label>
                   <div className="flex items-center gap-4">
                        <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.design2Opacity ?? 0.5) * 100)}%</span>
                        <button onClick={() => updateConfig({ showDesign2: !config.showDesign2 })} className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all ${config.showDesign2 ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>{config.showDesign2 ? 'Active' : 'Offline'}</button>
                   </div>
               </div>
               <div className="flex flex-wrap gap-2">
                   {JERSEY_COLORS.map(c => (
                       <button key={c.value} onClick={() => updateConfig({ design2Color: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.design2Color === c.value ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`} style={{ backgroundColor: c.value }} title={c.name} />
                   ))}
               </div>
               <input type="range" min="0" max="1" step="0.05" value={config.design2Opacity ?? 0.5} onChange={(e) => updateConfig({ design2Opacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>
        </div>
      )}

      {activeMatrix === 'identity' && (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* FRONT TEXT SYSTEM */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Front Text Inscription</label>
                    <span className="text-[8px] font-black text-amber-500 tabular-nums">{Math.round((config.frontTextScale ?? 1) * 100)}% Scale</span>
                </div>
                <input type="text" value={config.frontText || ''} onChange={(e) => updateConfig({ frontText: e.target.value.toUpperCase() })} placeholder="ENTER FRONT TEXT" className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-amber-500 transition-all" />
                
                <div className="grid grid-cols-3 gap-1">
                    {[
                        { id: 'none', label: 'Straight' },
                        { id: 'up', label: 'Arc Up' },
                        { id: 'down', label: 'Arc Down' }
                    ].map(arc => (
                        <button key={arc.id} onClick={() => updateConfig({ frontTextArc: arc.id as any })} className={`py-2 text-[8px] font-black uppercase tracking-widest border transition-all ${config.frontTextArc === arc.id ? 'bg-white text-black border-white' : 'text-white/20 border-white/5 hover:border-white/10'}`}>
                            {arc.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {JERSEY_COLORS.map(c => (
                        <button key={c.value} onClick={() => updateConfig({ frontTextColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.frontTextColor === c.value ? 'border-white' : 'border-white/10'}`} style={{ backgroundColor: c.value }} />
                    ))}
                </div>

                <input type="range" min="0.5" max="2.5" step="0.1" value={config.frontTextScale ?? 1} onChange={(e) => updateConfig({ frontTextScale: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Back Name (Aft Identity)</label>
                    <input type="text" value={config.name} onChange={(e) => updateConfig({ name: e.target.value.toUpperCase() })} placeholder="ENTER SURNAME" className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {JERSEY_COLORS.map(c => (
                        <button key={c.value} onClick={() => updateConfig({ nameColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.nameColor === c.value ? 'border-white' : 'border-white/10'}`} style={{ backgroundColor: c.value }} />
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Squad Number (Aft Registry)</label>
                    <input type="text" value={config.number} onChange={(e) => updateConfig({ number: e.target.value.replace(/\D/g, '').slice(0, 2) })} placeholder="00" className="w-40 bg-white/5 border border-white/10 p-4 text-2xl font-black text-center outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {JERSEY_COLORS.map(c => (
                        <button key={c.value} onClick={() => updateConfig({ numberColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${config.numberColor === c.value ? 'border-white' : 'border-white/10'}`} style={{ backgroundColor: c.value }} />
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeMatrix === 'graphics' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Approved Insignia</label>
           <div className="grid grid-cols-2 gap-4">
              {APPROVED_LOGOS.map(logo => (
                 <button key={logo.id} onClick={() => updateConfig({ logoImage: logo.imageUrl })} className={`p-6 border transition-all flex items-center justify-center bg-white/5 ${config.logoImage === logo.imageUrl ? 'border-white' : 'border-white/10 hover:border-white/20'}`}>
                    <img src={logo.imageUrl} alt={logo.name} className="max-h-12 w-auto object-contain invert grayscale opacity-60 hover:opacity-100 transition-all" />
                 </button>
              ))}
           </div>
           
           <div className="pt-6 border-t border-white/5 space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Asset Scaling</label>
                <input type="range" min="0.5" max="2" step="0.1" value={config.logoScale} onChange={(e) => updateConfig({ logoScale: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>
        </div>
      )}

      {activeMatrix === 'roster' && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => onTeamOrderChange(!isTeamOrder)} className={`flex-1 py-4 border text-[9px] font-black uppercase tracking-widest transition-all ${isTeamOrder ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}>
                    {isTeamOrder ? 'Fleet Active' : 'Individual Pilot'}
                </button>
            </div>

            {isTeamOrder && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="SURNAME" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} className="bg-white/5 border border-white/10 p-3 text-[10px] font-black uppercase outline-none focus:border-amber-500" />
                        <input type="text" placeholder="00" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(e.target.value)} className="bg-white/5 border border-white/10 p-3 text-[10px] font-black uppercase text-center outline-none focus:border-amber-500" />
                    </div>
                    <button onClick={addPlayer} className="w-full py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg shadow-amber-500/10">Add to Fleet</button>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {teamPlayers.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black uppercase">{p.name} #{p.number}</span>
                                <button onClick={() => onTeamPlayersChange(teamPlayers.filter(tp => tp.id !== p.id))} className="text-red-500 text-[8px] font-black uppercase tracking-widest hover:text-white transition-colors">Abort</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}

      <div className="pt-10 border-t border-white/5 flex flex-col gap-6">
          <div className="flex justify-between items-end">
              <div>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Estimated Credit Cost</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">${(price * (isTeamOrder ? teamPlayers.length || 1 : quantity)).toFixed(2)}</p>
              </div>
              <div className="text-right">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Unit Volume</p>
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/10">
                      <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white transition-colors">-</button>
                      <span className="text-sm font-black text-white tabular-nums">{quantity}</span>
                      <button onClick={() => onQuantityChange(quantity + 1)} className="text-white/40 hover:text-white transition-colors">+</button>
                  </div>
              </div>
          </div>
          
          <button onClick={onAddToCart} disabled={isAdding || (isTeamOrder && teamPlayers.length === 0)} className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.5em] hover:bg-amber-500 transition-all shadow-2xl relative overflow-hidden group">
              <span className="relative z-10">{isAdding ? 'COMMENCING PRODUCTION...' : 'INITIATE ORDER'}</span>
              <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
      </div>
    </div>
  );
}
