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
    <div className="bg-[#0a0a0a] border border-white/5 p-8 space-y-10 relative">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Configuration Matrix</h2>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">v2.1.0-STABLE</span>
      </div>
      
      {/* Order Type Toggle */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operational Mode</label>
        <div className="flex gap-1">
          <button
            onClick={() => { onTeamOrderChange(false); }}
            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all border ${
              !isTeamOrder 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-white/30 border-white/5 hover:border-white/10'
            }`}
          >
            Individual Unit
          </button>
          <button
            onClick={() => { onTeamOrderChange(true); }}
            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all border ${
              isTeamOrder 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-white/30 border-white/5 hover:border-white/10'
            }`}
          >
            Fleet / Roster
          </button>
        </div>
      </div>

      {/* Size Selection (For Individuals) */}
      {!isTeamOrder && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Unit Size</label>
          <div className="flex flex-wrap gap-1">
            {JERSEY_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`flex-1 min-w-[60px] py-3 text-[10px] font-black transition-all border ${
                    selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/30 border-white/5 hover:border-white/20'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Visual Identity Colors */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Primary Hull</label>
          <div className="flex flex-wrap gap-2">
            {JERSEY_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateConfig({ baseColor: color.value })}
                className={`w-8 h-8 rounded-none border transition-all ${
                  config.baseColor === color.value ? 'border-amber-500 scale-110' : 'border-white/10 hover:border-white/40'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
             <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Accent Color</label>
             <button 
                onClick={() => updateConfig({ accentSleeves: !config.accentSleeves })}
                className={`text-[8px] font-black uppercase px-2 py-0.5 border transition-all ${config.accentSleeves ? 'bg-amber-500 text-black border-amber-500' : 'text-white/20 border-white/10'}`}
             >
                {config.accentSleeves ? 'Enabled' : 'Disabled'}
             </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {JERSEY_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateConfig({ trimColor: color.value })}
                className={`w-8 h-8 rounded-none border transition-all ${
                  config.trimColor === color.value ? 'border-amber-500 scale-110' : 'border-white/10 hover:border-white/40'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <p className="text-[8px] text-white/20 uppercase tracking-tighter italic">
            Enable to apply accents to sleeves and collar.
          </p>
        </div>
      </div>
      
      {/* Logo Selection */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Strategic Identifier</label>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {logoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setLogoCategory(cat)}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                logoCategory === cat 
                  ? 'bg-amber-500 text-black border-amber-500' 
                  : 'bg-white/5 text-white/30 border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Logo Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {filteredLogos.map((logo: ApprovedLogo) => (
            <button
              key={logo.id}
              onClick={() => updateConfig({ logoImage: logo.imageUrl })}
              className={`aspect-square bg-white/[0.02] border transition-all hover:bg-white/5 flex items-center justify-center p-2 ${
                config.logoImage === logo.imageUrl ? 'border-amber-500' : 'border-white/5'
              }`}
              title={logo.name}
            >
              <div className="text-[8px] font-black text-white/20 uppercase text-center leading-none">
                {logo.name}
              </div>
            </button>
          ))}
        </div>
        
        {/* Custom Upload (optional) */}
        <details className="group">
          <summary className="text-[9px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
            Import External Asset
          </summary>
          <div className="mt-4 p-4 bg-white/5 border border-dashed border-white/10">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="w-full bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest py-4 border border-white/10 text-center transition-all">
                {config.logoImage ? 'Re-upload Asset' : 'Select Source File'}
              </div>
            </label>
            {config.logoImage && (
              <button
                onClick={() => updateConfig({ logoImage: undefined })}
                className="mt-3 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-widest w-full text-center"
              >
                Purge Asset
              </button>
            )}
          </div>
        </details>
        
        {config.logoImage && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-end">
               <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Asset Scale</label>
               <span className="text-[10px] font-black text-white italic">{Math.round(config.logoScale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={config.logoScale}
              onChange={(e) => updateConfig({ logoScale: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
      
      {/* Team Names Toggle (only in team mode) */}
      {isTeamOrder && (
        <div className="bg-amber-500/5 border border-amber-500/10 p-6">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`w-5 h-5 border transition-all flex items-center justify-center ${config.useTeamNames ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
               {config.useTeamNames && <span className="text-black text-[10px] font-black italic">✓</span>}
            </div>
            <input
              type="checkbox"
              checked={config.useTeamNames}
              onChange={(e) => updateConfig({ useTeamNames: e.target.checked })}
              className="hidden"
            />
            <span className="text-xs font-black uppercase tracking-widest text-white/80">Enable Individual Roster Serialization</span>
          </label>
          <p className="text-white/20 text-[9px] font-medium mt-3 ml-9 uppercase tracking-tighter">
            Assign unique designators to each unit in the fleet.
          </p>
        </div>
      )}
      
      {/* Shared Name/Number (for non-team or shared design) */}
      {(!isTeamOrder || !config.useTeamNames) && (
        <div className="space-y-8 pt-6 border-t border-white/10">
          {/* Team Name */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Corporate/Team Name (Front)</label>
            <input
              type="text"
              value={config.teamName || ''}
              onChange={(e) => updateConfig({ teamName: e.target.value.toUpperCase() })}
              placeholder="ENTER TEAM NAME"
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white text-lg font-black placeholder-white/10 focus:outline-none focus:border-amber-500 italic transition-all"
            />
            {config.teamName && (
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Font Scale</label>
                     <span className="text-[10px] font-black text-white italic">{Math.round(config.teamNameScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.teamNameScale}
                    onChange={(e) => updateConfig({ teamNameScale: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer"
                  />
               </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Tactical Name (Back)</label>
               <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">MAX 15 CHARS</span>
            </div>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value.toUpperCase() })}
              placeholder="YOUR NAME"
              maxLength={15}
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white text-lg font-black placeholder-white/10 focus:outline-none focus:border-amber-500 italic transition-all"
            />
            {config.name && (
               <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-end">
                     <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Font Scale</label>
                     <span className="text-[10px] font-black text-white italic">{Math.round(config.nameScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.nameScale}
                    onChange={(e) => updateConfig({ nameScale: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer"
                  />
               </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Typeface</label>
                <select
                  value={config.nameFont}
                  onChange={(e) => updateConfig({ nameFont: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-3 text-white text-[10px] font-black uppercase appearance-none focus:border-amber-500 outline-none"
                >
                  {JERSEY_FONTS.map((font) => (
                    <option key={font.value} value={font.value} className="bg-black">{font.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Chroma</label>
                <div className="flex items-center h-[46px] bg-white/5 border border-white/10 px-3">
                   <input
                    type="color"
                    value={config.nameColor}
                    onChange={(e) => updateConfig({ nameColor: e.target.value })}
                    className="w-full h-6 bg-transparent cursor-pointer border-none"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Number */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Unit Designation</label>
            <input
              type="text"
              value={config.number}
              onChange={(e) => updateConfig({ number: e.target.value.replace(/\D/g, '').slice(0, 2) })}
              placeholder="00"
              maxLength={2}
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-6 text-white text-5xl font-black placeholder-white/5 focus:outline-none focus:border-amber-500 text-center italic transition-all"
            />
            {config.number && (
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Designator Scale</label>
                     <span className="text-[10px] font-black text-white italic">{Math.round(config.numberScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={config.numberScale}
                    onChange={(e) => updateConfig({ numberScale: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 bg-white/5 h-1 appearance-none cursor-pointer"
                  />
               </div>
            )}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Typeface</label>
                  <select
                    value={config.numberFont}
                    onChange={(e) => updateConfig({ numberFont: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-3 text-white text-[10px] font-black uppercase appearance-none focus:border-amber-500 outline-none"
                  >
                    {JERSEY_FONTS.map((font) => (
                      <option key={font.value} value={font.value} className="bg-black">{font.name}</option>
                    ))}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Positioning</label>
                  <div className="flex gap-1">
                    {(['front', 'back', 'both'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => updateConfig({ numberType: pos })}
                        className={`flex-1 py-3 text-[9px] font-black uppercase transition-all border ${
                          config.numberType === pos 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/5 text-white/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Team Players List (team order mode) */}
      {isTeamOrder && config.useTeamNames && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            Deployment Roster ({teamPlayers.length})
          </label>
          
          {/* Add Player Form */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="ID"
                maxLength={15}
                className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic placeholder-white/10 focus:border-amber-500 outline-none uppercase"
              />
              <input
                type="text"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
                placeholder="#"
                maxLength={2}
                className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[11px] font-black italic placeholder-white/10 focus:border-amber-500 outline-none text-center"
              />
              <select
                value={newPlayerSize}
                onChange={(e) => setNewPlayerSize(e.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-3 text-white text-[10px] font-black uppercase appearance-none"
              >
                {JERSEY_SIZES.map((size) => (
                  <option key={size} value={size} className="bg-black">{size}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addPlayer}
              disabled={!newPlayerName.trim() || !newPlayerNumber.trim()}
              className="w-full bg-white text-black py-4 text-[11px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-amber-500 transition-all"
            >
              Authorize Unit
            </button>
          </div>
          
          {/* Players List */}
          {teamPlayers.length > 0 && (
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {teamPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 px-4 py-3 group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-amber-500 font-black italic w-6 text-sm">#{player.number}</span>
                    <span className="text-white font-black text-[11px] uppercase italic tracking-tighter">{player.name}</span>
                    <span className="text-white/20 text-[9px] font-black uppercase">[{player.size}]</span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-white/10 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Price & Execution */}
      <div className="pt-10 border-t border-white/10 relative">
        {/* Decorative scanline */}
        <div className="absolute top-0 right-0 w-16 h-[1px] bg-amber-500" />
        
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">
              Transaction Total
            </span>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
              {isTeamOrder 
                ? `${getTeamQuantity()} UNITS SERIALIZED` 
                : `${quantity} UNIT PRODUCTION`
              }
            </span>
          </div>
          <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">${(price * getTeamQuantity()).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onAddToCart}
          disabled={isAdding || (isTeamOrder && config.useTeamNames && teamPlayers.length === 0)}
          className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 text-xs uppercase tracking-[0.4em] transition-all disabled:opacity-20 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
        >
          {isAdding 
            ? 'EXECUTING...' 
            : 'INITIALIZE PRODUCTION'
          }
        </button>
      </div>
    </div>
  );
}
