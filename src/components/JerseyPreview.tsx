'use client';

import React, { useState, useRef } from 'react';
import { CustomJerseyConfig } from '@/types';

interface JerseyPreviewProps {
  config: CustomJerseyConfig;
  size?: string;
  playerName?: string;
  playerNumber?: string;
  previewOnly?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

export default function JerseyPreview({ 
  config, 
  size = 'M', 
  playerName,
  playerNumber,
  previewOnly = false,
  onPositionChange
}: JerseyPreviewProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effective values (player overrides shared design)
  const effectiveName = previewOnly && playerName ? playerName : (config.useTeamNames ? '' : config.name);
  const effectiveNumber = previewOnly && playerNumber ? playerNumber : config.number;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewOnly || view === 'back') return; 
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || previewOnly || !containerRef.current || view === 'back') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Constrain to jersey area (roughly)
    const constrainedX = Math.max(35, Math.min(65, x));
    const constrainedY = Math.max(25, Math.min(65, y));
    
    onPositionChange?.({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scale based on size
  const scaleMap: Record<string, number> = {
    'XS': 0.85, 'S': 0.9, 'M': 1.0, 'L': 1.1, 'XL': 1.2, '2XL': 1.3, '3XL': 1.4, '4XL': 1.5
  };
  const scale = scaleMap[size] || 1.0;

  return (
    <div 
      ref={containerRef}
      className="relative bg-zinc-900 rounded-lg p-8 overflow-hidden select-none"
      style={{ minHeight: '550px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* View Toggle */}
      <div className="absolute top-4 left-4 flex gap-1 z-30">
        <button 
          onClick={() => setView('front')}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border ${view === 'front' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
        >
          Front
        </button>
        <button 
          onClick={() => setView('back')}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border ${view === 'back' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
        >
          Back
        </button>
      </div>

      {/* Jersey Container */}
      <div 
        className="relative mx-auto transition-all duration-500 ease-in-out"
        style={{ 
          width: '280px',
          height: '380px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginTop: '40px'
        }}
      >
        {/* Jersey SVG */}
        <svg
          viewBox="0 0 200 280"
          className="w-full h-full drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' }}
        >
          <defs>
            <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.baseColor} />
              <stop offset="50%" stopColor={config.baseColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={config.baseColor} />
            </linearGradient>
            <filter id="innerShadow">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feFlood floodColor="black" floodOpacity="0.5" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>
          </defs>

          {/* Main Jersey Body */}
          <path
            d="M30 60 L10 80 L10 140 L25 145 L30 120 L30 260 L60 270 L60 280 L140 280 L140 270 L170 260 L170 120 L175 145 L190 140 L190 80 L170 60 L155 40 L140 50 L100 55 L60 50 L45 40 Z"
            fill="url(#jerseyGradient)"
            stroke={config.trimColor}
            strokeWidth="1.5"
            filter="url(#innerShadow)"
          />
          
          {/* Folds and Texture (Subtle) */}
          <path d="M100 55 V280" stroke="black" strokeWidth="0.5" opacity="0.1" />
          <path d="M60 270 Q100 275 140 270" fill="none" stroke="black" strokeWidth="1" opacity="0.1" />
          
          {/* Collar */}
          <path
            d="M60 50 Q100 65 140 50"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {view === 'front' ? (
            <>
              {/* Team Name on Front */}
              {config.teamName && (
                <text
                  x="100"
                  y="105"
                  textAnchor="middle"
                  fontFamily={config.nameFont}
                  fontSize="18"
                  fontWeight="black"
                  fill={config.nameColor}
                  className="uppercase italic tracking-tighter"
                  style={{ letterSpacing: '2px' }}
                >
                  {config.teamName}
                </text>
              )}

              {/* Front Number (Small, optional depending on style) */}
              {(config.numberPosition === 'front' || config.numberPosition === 'both') && effectiveNumber && (
                <text
                  x="100"
                  y="180"
                  textAnchor="middle"
                  fontFamily={config.numberFont}
                  fontSize="48"
                  fontWeight="black"
                  fill={config.numberColor}
                  opacity="0.9"
                >
                  {effectiveNumber}
                </text>
              )}
            </>
          ) : (
            <>
              {/* Name on Back */}
              {effectiveName && (
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  fontFamily={config.nameFont}
                  fontSize="18"
                  fontWeight="black"
                  fill={config.nameColor}
                  className="uppercase italic"
                >
                  {effectiveName}
                </text>
              )}

              {/* Number on Back */}
              {(config.numberPosition === 'back' || config.numberPosition === 'both' || config.numberPosition === 'front') && effectiveNumber && (
                <text
                  x="100"
                  y="180"
                  textAnchor="middle"
                  fontFamily={config.numberFont}
                  fontSize="96"
                  fontWeight="black"
                  fill={config.numberColor}
                  stroke={config.trimColor}
                  strokeWidth="1"
                >
                  {effectiveNumber}
                </text>
              )}
            </>
          )}
        </svg>
        
        {/* Logo Overlay (Draggable - Front Only) */}
        {view === 'front' && config.logoImage && (
          <div
            className={`absolute ${isDragging ? 'scale-110' : ''} ${previewOnly ? 'cursor-default' : 'cursor-move'}`}
            style={{
              left: `${config.logoPosition.x}%`,
              top: `${config.logoPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${config.logoScale})`,
              zIndex: 40,
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Logo Border/Indicator in Edit Mode */}
            {!previewOnly && (
               <div className="absolute inset-0 border border-amber-500/20 rounded scale-125 opacity-0 group-hover:opacity-100" />
            )}
            <img 
              src={config.logoImage} 
              alt="Custom Logo" 
              className="max-w-16 max-h-16 object-contain drop-shadow-lg"
              draggable={false}
            />
          </div>
        )}
      </div>
      
      {/* HUD Info */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Projection Angle</span>
        <span className="text-sm font-black text-white italic uppercase">{view} View</span>
      </div>
      
      {/* Color Swatches */}
      <div className="absolute bottom-4 left-4 flex gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/20 uppercase">Hull</span>
          <div className="w-8 h-2 bg-white/5 border border-white/10" style={{ backgroundColor: config.baseColor }} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/20 uppercase">Trim</span>
          <div className="w-8 h-2 bg-white/5 border border-white/10" style={{ backgroundColor: config.trimColor }} />
        </div>
      </div>
    </div>
  );
}
