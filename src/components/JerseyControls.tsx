'use client';

import React, { useState } from 'react';
import { CustomJerseyConfig, JERSEY_COLORS, JERSEY_FONTS, JERSEY_SIZES, APPROVED_LOGOS, ApprovedLogo, TeamPlayer, JERSEY_DESIGNS } from '@/types';
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
  const [activeMatrix, setActiveMatrix] = useState<'design' | 'colors' | 'decoration' | 'roster'>('design');

  const handleCustomTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateConfig({ customTemplateUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = () => {
    if (!newPlayerName.trim() || !newPlayerNumber.trim()) return;
    onTeamPlayersChange([...teamPlayers, { id: uuidv4(), name: newPlayerName.toUpperCase().slice(0, 15), number: newPlayerNumber.replace(/\D/g, '').slice(0, 2), size: newPlayerSize }]);
    setNewPlayerName(''); setNewPlayerNumber('');
  };

  const getTeamQuantity = () => isTeamOrder ? (teamPlayers.length > 0 ? teamPlayers.length : 1) : quantity;

  return (
    <div className="bg-[#050505] border border-white/5 p-8 space-y-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Production Matrix</h2>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">Design-First Sublimation Suite</p>
        </div>
      </div>

      <div className="flex border-b border-white/10">
        {[ { id: 'design', label: 'Template' }, { id: 'colors', label: 'Identity' }, { id: 'decoration', label: 'Graphics' }, { id: 'roster', label: 'Roster' } ].map(tab => (
            <button key={tab.id} onClick={() => setActiveMatrix(tab.id as any)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeMatrix === tab.id ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
                {tab.label}
                {activeMatrix === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />}
            </button>
        ))}
      </div>

      {activeMatrix === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Select Tactical Base</label>
           <div className="grid grid-cols-1 gap-2">
              {JERSEY_DESIGNS.map(d => (
                 <button key={d.id} onClick={() => updateConfig({ designId: d.id, customTemplateUrl: undefined })} className={`flex flex-col p-6 border transition-all text-left group ${config.designId === d.id && !config.customTemplateUrl ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-start">
                       <span className="text-lg font-black italic uppercase tracking-tighter">{d.name}</span>
                       {config.designId === d.id && !config.customTemplateUrl && <span className="text-[10px] font-bold">ACTIVE</span>}
                    </div>
                    <p className={`text-[10px] font-medium mt-1 leading-relaxed ${config.designId === d.id && !config.customTemplateUrl ? 'text-black/60' : 'text-white/20'}`}>{d.description}</p>
                 </button>
              ))}
           </div>

           <div className="pt-8 border-t border-white/5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4">Import Custom Asset Pattern</label>
              <div className={`p-6 border-2 border-dashed transition-all ${config.customTemplateUrl ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
                 <input type="file" accept="image/*" onChange={handleCustomTemplateUpload} className="hidden" id="template-upload" />
                 <label htmlFor="template-upload" className="cursor-pointer block text-center">
                    <p className="text-sm font-black text-white uppercase italic">{config.customTemplateUrl ? 'Replace Pattern Asset' : 'Upload Design Asset'}</p>
                    <p className="text-[9px] text-white/40 mt-2 uppercase tracking-tighter">Required: Transparent PNG (White patterns work best)</p>
                 </label>
                 {config.customTemplateUrl && (
                    <button onClick={() => updateConfig({ customTemplateUrl: undefined })} className="w-full mt-4 text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-all">Clear Custom Asset</button>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeMatrix === 'colors' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           {[ { id: 'primaryColor', label: 'Primary Hull' }, { id: 'accent1Color', label: 'Secondary Accent' }, { id: 'accent2Color', label: 'Tertiary Accent' } ].map(zone => (
               <div key={zone.id} className="space-y-4">
                   <div className="flex justify-between items-end">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{zone.label}</label>
                       {config.customTemplateUrl && (zone.id === 'accent1Color' || zone.id === 'accent2Color') && (
                          <button 
                            onClick={() => updateConfig({ customTemplateColor: zone.id === 'accent1Color' ? 'accent1' : 'accent2' })}
                            className={`text-[8px] font-black uppercase px-1.5 border ${config.customTemplateColor === (zone.id === 'accent1Color' ? 'accent1' : 'accent2') ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/10 text-white/20'}`}
                          >
                            Apply to Custom Asset
                          </button>
                       )}
                   </div>
                   <div className="flex flex-wrap gap-2">
                       {JERSEY_COLORS.map((color) => (
                           <button key={color.value} onClick={() => updateConfig({ [zone.id]: color.value })} className={`w-8 h-8 rounded-none border transition-all ${ (config as any)[zone.id] === color.value ? 'border-amber-500 scale-110' : 'border-white/5 hover:border-white/20' }`} style={{ backgroundColor: color.value }} />
                       ))}
                       <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative">
                           <input type="color" value={(config as any)[zone.id]} onChange={(e) => updateConfig({ [zone.id]: e.target.value })} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer" />
                       </div>
                   </div>
               </div>
           ))}
           <div className="pt-6 border-t border-white/5 space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Pattern Intensity / Opacity</label>
                <input type="range" min="0.05" max="0.8" step="0.05" value={config.patternOpacity} onChange={(e) => updateConfig({ patternOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer" />
           </div>
        </div>
      )}

      {activeMatrix === 'decoration' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Primary Insignia</label>
              <div className="grid grid-cols-4 gap-2">
                 {APPROVED_LOGOS.map((logo: ApprovedLogo) => (
                    <button key={logo.id} onClick={() => updateConfig({ logoImage: logo.imageUrl })} className={`aspect-square bg-white/[0.02] border transition-all hover:bg-white/5 flex items-center justify-center p-2 ${ config.logoImage === logo.imageUrl ? 'border-amber-500' : 'border-white/5' }`}>
                        <div className="text-[8px] font-black text-white/20 uppercase text-center leading-none">{logo.name}</div>
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-8 border-t border-white/5 pt-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Team Name (Front)</label>
                <input type="text" value={config.teamName || ''} onChange={(e) => updateConfig({ teamName: e.target.value.toUpperCase() })} placeholder="ENTER TEAM NAME" className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white text-lg font-black placeholder-white/10 focus:border-amber-500 outline-none italic" />
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Text Formatting</label>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center"><span className="text-[8px] font-black text-white/20 uppercase mb-1">Fill</span><input type="color" value={config.nameColor} onChange={(e) => updateConfig({ nameColor: e.target.value })} className="w-8 h-4 bg-transparent cursor-pointer" /></div>
                        <div className="flex flex-col items-center"><span className="text-[8px] font-black text-white/20 uppercase mb-1">Stroke</span><input type="color" value={config.nameOutlineColor} onChange={(e) => updateConfig({ nameOutlineColor: e.target.value })} className="w-8 h-4 bg-transparent cursor-pointer" /></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[9px] font-black text-white/20 uppercase"><span>Outline Width</span><span>{config.nameOutlineWidth}px</span></div>
                    <input type="range" min="0" max="3" step="0.5" value={config.nameOutlineWidth} onChange={(e) => updateConfig({ nameOutlineWidth: parseFloat(e.target.value), numberOutlineWidth: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-white/5 h-1 appearance-none" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2"><label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Typeface</label><select value={config.nameFont} onChange={(e) => updateConfig({ nameFont: e.target.value, numberFont: e.target.value })} className="w-full bg-white/5 border border-white/10 px-3 py-3 text-white text-[10px] font-black uppercase focus:border-amber-500 outline-none">{JERSEY_FONTS.map((font) => <option key={font.value} value={font.value} className="bg-black">{font.name}</option>)}</select></div>
                 <div className="space-y-2"><label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Serial Display</label><div className="flex gap-1">{(['front', 'back', 'both'] as const).map((pos) => <button key={pos} onClick={() => updateConfig({ numberType: pos })} className={`flex-1 py-3 text-[9px] font-black uppercase transition-all border ${config.numberType === pos ? 'bg-white text-black border-white' : 'bg-white/5 text-white/30 border-white/10'}`}>{pos[0]}</button>)}</div></div>
              </div>
           </div>
        </div>
      )}

      {activeMatrix === 'roster' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="bg-amber-500/5 border border-amber-500/10 p-6"><label className="flex items-center gap-4 cursor-pointer group"><div className={`w-5 h-5 border transition-all flex items-center justify-center ${config.useTeamNames ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-white/20'}`}>{config.useTeamNames && <span className="text-black text-[10px] font-black italic">✓</span>}</div><input type="checkbox" checked={config.useTeamNames} onChange={(e) => updateConfig({ useTeamNames: e.target.checked })} className="hidden" /><span className="text-xs font-black uppercase tracking-widest text-white/80">Deploy Individual Identifiers</span></label></div>
           <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                 <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="NAME" className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic outline-none uppercase" />
                    <input type="text" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(e.target.value)} placeholder="#" className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic outline-none text-center" />
                    <select value={newPlayerSize} onChange={(e) => setNewPlayerSize(e.target.value)} className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[10px] font-black uppercase">{JERSEY_SIZES.map((size) => <option key={size} value={size} className="bg-black">{size}</option>)}</select>
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
                                <span className="text-white/20 text-[9px] font-black uppercase">[{player.size}]</span></div>
                            <button onClick={() => onTeamPlayersChange(teamPlayers.filter(p => p.id !== player.id))} className="text-white/10 hover:text-red-500 transition-colors">✕</button>
                        </div>
                    ))}
                </div>
              )}
           </div>
        </div>
      )}

      <div className="pt-10 border-t border-white/10 relative">
        {!isTeamOrder && (
           <div className="mb-8 p-4 bg-white/5 border border-white/10">
              <label className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Unit Scale</label>
              <div className="flex gap-1">{JERSEY_SIZES.map(s => <button key={s} onClick={() => onSizeChange(s)} className={`flex-1 py-2 text-[9px] font-black transition-all border ${selectedSize === s ? 'bg-white text-black border-white' : 'bg-transparent text-white/20 border-white/5'}`}>{s}</button>)}</div>
           </div>
        )}
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col"><span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Projected Total</span><span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{getTeamQuantity()} UNITS READY</span></div>
          <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">${(price * getTeamQuantity()).toFixed(2)}</span>
        </div>
        <button onClick={onAddToCart} disabled={isAdding || (isTeamOrder && config.useTeamNames && teamPlayers.length === 0)} className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 text-xs uppercase tracking-[0.4em] transition-all disabled:opacity-20 shadow-[0_0_50px_rgba(255,255,255,0.05)]">{isAdding ? 'TRANSMITTING...' : 'INITIALIZE PRODUCTION'}</button>
      </div>
    </div>
  );
}
