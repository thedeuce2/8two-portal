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
  price
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
    <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Customize Your Jersey</h2>
      
      {/* Order Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => { onTeamOrderChange(false); }}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
              !isTeamOrder 
                ? 'bg-white text-black' 
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => { onTeamOrderChange(true); }}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
              isTeamOrder 
                ? 'bg-white text-black' 
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            Team / Bulk
          </button>
        </div>
      </div>
      
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {isTeamOrder ? 'Default Size (for new players)' : 'Size'}
        </label>
        <div className="flex flex-wrap gap-2">
          {JERSEY_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => isTeamOrder ? setNewPlayerSize(size) : updateConfig({ logoPosition: { ...config.logoPosition } })}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Base Color */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Base Color</label>
        <div className="flex flex-wrap gap-2">
          {JERSEY_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => updateConfig({ baseColor: color.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                config.baseColor === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      {/* Trim Color */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Trim Color</label>
        <div className="flex flex-wrap gap-2">
          {JERSEY_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => updateConfig({ trimColor: color.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                config.trimColor === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      {/* Logo Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Logo (Admin Approved)
        </label>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {logoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setLogoCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full capitalize whitespace-nowrap transition-colors ${
                logoCategory === cat 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
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
              className={`aspect-square bg-zinc-800 rounded-lg p-2 border-2 transition-all hover:bg-zinc-700 ${
                config.logoImage === logo.imageUrl ? 'border-white' : 'border-transparent'
              }`}
              title={logo.name}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                {logo.name}
              </div>
            </button>
          ))}
        </div>
        
        {/* Custom Upload (optional) */}
        <details className="group">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
            Or upload custom logo (will be reviewed)
          </summary>
          <div className="mt-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg text-center transition-colors">
                {config.logoImage ? 'Change Logo' : 'Choose File'}
              </div>
            </label>
            {config.logoImage && (
              <button
                onClick={() => updateConfig({ logoImage: undefined })}
                className="mt-2 text-red-400 hover:text-red-300 text-sm"
              >
                Remove custom logo
              </button>
            )}
          </div>
        </details>
        
        {config.logoImage && (
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">Logo Scale</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={config.logoScale}
              onChange={(e) => updateConfig({ logoScale: parseFloat(e.target.value) })}
              className="w-full accent-white"
            />
          </div>
        )}
      </div>
      
      {/* Team Names Toggle (only in team mode) */}
      {isTeamOrder && (
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.useTeamNames}
              onChange={(e) => updateConfig({ useTeamNames: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-zinc-700 text-white focus:ring-white"
            />
            <span className="text-white font-medium">Use individual player names</span>
          </label>
          <p className="text-gray-400 text-xs mt-1 ml-8">
            Each player will have their own name and number. Uncheck to use shared design.
          </p>
        </div>
      )}
      
      {/* Shared Name/Number (for non-team or shared design) */}
      {(!isTeamOrder || !config.useTeamNames) && (
        <>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Player Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value.toUpperCase() })}
              placeholder="YOUR NAME"
              maxLength={15}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"
            />
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Font</label>
                <select
                  value={config.nameFont}
                  onChange={(e) => updateConfig({ nameFont: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {JERSEY_FONTS.map((font) => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  value={config.nameColor}
                  onChange={(e) => updateConfig({ nameColor: e.target.value })}
                  className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Jersey Number</label>
            <input
              type="text"
              value={config.number}
              onChange={(e) => updateConfig({ number: e.target.value.replace(/\D/g, '').slice(0, 2) })}
              placeholder="00"
              maxLength={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white text-center text-2xl font-bold"
            />
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Font</label>
                <select
                  value={config.numberFont}
                  onChange={(e) => updateConfig({ numberFont: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {JERSEY_FONTS.map((font) => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  value={config.numberColor}
                  onChange={(e) => updateConfig({ numberColor: e.target.value })}
                  className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs text-gray-400 mb-1">Number Position</label>
              <div className="flex gap-2">
                {(['front', 'back', 'both'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateConfig({ numberPosition: pos })}
                    className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${
                      config.numberPosition === pos 
                        ? 'bg-white text-black' 
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Team Players List (team order mode) */}
      {isTeamOrder && config.useTeamNames && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add Players ({teamPlayers.length} added)
          </label>
          
          {/* Add Player Form */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Name"
                maxLength={15}
                className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400"
              />
              <input
                type="text"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
                placeholder="#"
                maxLength={2}
                className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm placeholder-gray-400"
              />
              <select
                value={newPlayerSize}
                onChange={(e) => setNewPlayerSize(e.target.value)}
                className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm"
              >
                {JERSEY_SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addPlayer}
              disabled={!newPlayerName.trim() || !newPlayerNumber.trim()}
              className="w-full bg-white text-black py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              Add Player
            </button>
          </div>
          
          {/* Players List */}
          {teamPlayers.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold w-8">#{player.number}</span>
                    <span className="text-white">{player.name}</span>
                    <span className="text-gray-400 text-sm">({player.size})</span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {teamPlayers.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              Add at least one player to continue
            </p>
          )}
        </div>
      )}
      
      {/* Quantity (only for individual orders) */}
      {!isTeamOrder && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-2xl flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-2xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      )}
      
      {/* Price & Add to Cart */}
      <div className="pt-4 border-t border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">
            {isTeamOrder 
              ? `Total (${getTeamQuantity()} jerseys)` 
              : `Total (${quantity} jersey${quantity > 1 ? 's' : ''})`
            }
          </span>
          <span className="text-2xl font-bold text-white">${(price * getTeamQuantity()).toFixed(2)}</span>
        </div>
        <button
          onClick={onAddToCart}
          disabled={isAdding || (isTeamOrder && config.useTeamNames && teamPlayers.length === 0)}
          className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding 
            ? 'Adding...' 
            : isTeamOrder 
              ? `Add ${getTeamQuantity()} Jerseys to Cart`
              : `Add ${quantity} Jersey${quantity > 1 ? 's' : ''} to Cart`
          }
        </button>
      </div>
    </div>
  );
}
