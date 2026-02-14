'use client';

import React, { useState, useRef } from 'react';
import { CustomJerseyConfig } from '@/types';

interface JerseyPreviewProps {
  config: CustomJerseyConfig;
  size?: string;
  playerName?: string;
  playerNumber?: string;
  previewOnly?: boolean;
  onConfigChange?: (updates: Partial<CustomJerseyConfig>) => void;
}

type DragTarget = 'logo' | 'name' | 'number' | 'teamName' | null;

export default function JerseyPreview({ 
  config, 
  size = 'M', 
  playerName,
  playerNumber,
  previewOnly = false,
  onConfigChange
}: JerseyPreviewProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effective values (player overrides shared design)
  const effectiveName = previewOnly && playerName ? playerName : (config.useTeamNames ? '' : config.name);
  const effectiveNumber = previewOnly && playerNumber ? playerNumber : config.number;

  const handleMouseDown = (target: DragTarget) => {
    if (previewOnly) return; 
    setDragTarget(target);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || previewOnly || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Constrain to jersey area
    const constrainedX = Math.max(15, Math.min(85, x));
    const constrainedY = Math.max(10, Math.min(90, y));
    
    if (dragTarget === 'logo') {
      onConfigChange?.({ logoPosition: { x: constrainedX, y: constrainedY } });
    } else if (dragTarget === 'name') {
      onConfigChange?.({ namePosition: { y: constrainedY } });
    } else if (dragTarget === 'number') {
      onConfigChange?.({ numberPosition: { y: constrainedY } });
    } else if (dragTarget === 'teamName') {
      onConfigChange?.({ teamNamePosition: { y: constrainedY } });
    }
  };

  const handleMouseUp = () => {
    setDragTarget(null);
  };

  // Scale based on size
  const scaleMap: Record<string, number> = {
    'XS': 0.85, 'S': 0.9, 'M': 1.0, 'L': 1.1, 'XL': 1.2, '2XL': 1.3, '3XL': 1.4, '4XL': 1.5
  };
  const scale = scaleMap[size] || 1.0;

  return (
    <div 
      ref={containerRef}
      className="relative bg-zinc-950 rounded-lg p-8 overflow-hidden select-none border border-white/5 shadow-inner"
      style={{ minHeight: '600px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
         <div className="absolute top-0 left-[20%] w-px h-full bg-white/10" />
         <div className="absolute top-0 right-[20%] w-px h-full bg-white/10" />
      </div>

      {/* View Toggle */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Perspective Control</span>
        <div className="flex gap-1 bg-black/40 p-1 border border-white/10 rounded-sm">
            <button 
                onClick={() => setView('front')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'front' ? 'bg-white text-black' : 'text-white/30 hover:text-white/60'}`}
            >
                Front
            </button>
            <button 
                onClick={() => setView('back')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'back' ? 'bg-white text-black' : 'text-white/30 hover:text-white/60'}`}
            >
                Back
            </button>
        </div>
      </div>

      {/* Jersey Scale Visualizer */}
      <div 
        className="relative mx-auto transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ 
          width: '320px',
          height: '420px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginTop: '60px'
        }}
      >
        {/* SVG Renderer */}
        <svg
          viewBox="0 0 200 280"
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <defs>
            <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
               <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
               <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>

            {/* Patterns */}
            <pattern id="meshPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
               <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="none" stroke={config.patternColor} strokeWidth="0.5" opacity={config.patternOpacity} />
            </pattern>

            <pattern id="geometricPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
               <rect width="20" height="40" fill={config.patternColor} opacity={config.patternOpacity} />
            </pattern>

            <pattern id="camoPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
               <circle cx="20" cy="20" r="15" fill={config.patternColor} opacity={config.patternOpacity} />
               <circle cx="60" cy="70" r="25" fill={config.patternColor} opacity={config.patternOpacity} />
               <circle cx="80" cy="30" r="10" fill={config.patternColor} opacity={config.patternOpacity} />
            </pattern>

            <filter id="fabricTexture">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffuse">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
              <feComposite operator="in" in="diffuse" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* SIDE PANELS */}
          <path
            d="M30 120 L10 140 L10 260 L30 260 Z"
            fill={config.sidePanelColor}
          />
          <path
            d="M170 120 L190 140 L190 260 L170 260 Z"
            fill={config.sidePanelColor}
          />

          {/* MAIN BODY PANEL */}
          <path
            d="M30 60 L170 60 L170 260 L140 280 L60 280 L30 260 Z"
            fill={config.baseColor}
          />
          
          {/* APPLY PATTERN OVER MAIN BODY */}
          {config.pattern !== 'none' && (
            <path
              d="M30 60 L170 60 L170 260 L140 280 L60 280 L30 260 Z"
              fill={`url(#${config.pattern}Pattern)`}
              pointerEvents="none"
            />
          )}

          {/* YOKE / SHOULDERS */}
          <path
            d="M30 60 L60 50 L100 55 L140 50 L170 60 L155 40 L45 40 Z"
            fill={config.yokeColor}
          />

          {/* SLEEVES */}
          <path
            d="M30 60 L10 80 L10 140 L25 145 L30 120 Z"
            fill={config.sleeveColor}
          />
          <path
            d="M170 60 L190 80 L190 140 L175 145 L170 120 Z"
            fill={config.sleeveColor}
          />

          {/* COLLAR TRIM */}
          <path
            d="M60 50 Q100 65 140 50"
            fill="none"
            stroke={config.collarColor}
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* OVERLAY DEPTH & SHADOWS */}
          <path
            d="M30 60 L10 80 L10 140 L25 145 L30 120 L30 260 L60 280 L140 280 L170 260 L170 120 L175 145 L190 140 L190 80 L170 60 L155 40 L100 55 L45 40 Z"
            fill="url(#panelGradient)"
            pointerEvents="none"
            opacity="0.3"
          />

          {/* SEAMS (Faint definition) */}
          <path d="M30 60 V260" stroke="black" strokeWidth="0.5" opacity="0.2" />
          <path d="M170 60 V260" stroke="black" strokeWidth="0.5" opacity="0.2" />
          <path d="M30 60 L45 40" stroke="black" strokeWidth="0.5" opacity="0.2" />
          <path d="M170 60 L155 40" stroke="black" strokeWidth="0.5" opacity="0.2" />

          {/* DECORATIONS */}
          {view === 'front' ? (
            <>
              {/* Team Name - DRAGGABLE */}
              {config.teamName && (
                <text
                  x="100"
                  y={`${config.teamNamePosition.y}%`}
                  textAnchor="middle"
                  fontFamily={config.nameFont}
                  fontSize={18 * config.teamNameScale}
                  fontWeight="black"
                  fill={config.nameColor}
                  stroke={config.teamNameOutlineColor}
                  strokeWidth={config.nameOutlineWidth}
                  className={`uppercase italic tracking-tighter ${previewOnly ? 'cursor-default' : 'cursor-move hover:fill-amber-500'}`}
                  style={{ letterSpacing: '2px' }}
                  onMouseDown={() => handleMouseDown('teamName')}
                >
                  {config.teamName}
                </text>
              )}

              {/* Front Number - DRAGGABLE */}
              {(config.numberType === 'front' || config.numberType === 'both') && effectiveNumber && (
                <text
                  x="100"
                  y={`${config.numberPosition.y}%`}
                  textAnchor="middle"
                  fontFamily={config.numberFont}
                  fontSize={48 * config.numberScale}
                  fontWeight="black"
                  fill={config.numberColor}
                  stroke={config.numberOutlineColor}
                  strokeWidth={config.numberOutlineWidth}
                  opacity="0.9"
                  className={`${previewOnly ? 'cursor-default' : 'cursor-move hover:fill-amber-500'}`}
                  onMouseDown={() => handleMouseDown('number')}
                >
                  {effectiveNumber}
                </text>
              )}
            </>
          ) : (
            <>
              {/* Name on Back - DRAGGABLE */}
              {effectiveName && (
                <text
                  x="100"
                  y={`${config.namePosition.y}%`}
                  textAnchor="middle"
                  fontFamily={config.nameFont}
                  fontSize={18 * config.nameScale}
                  fontWeight="black"
                  fill={config.nameColor}
                  stroke={config.nameOutlineColor}
                  strokeWidth={config.nameOutlineWidth}
                  className={`uppercase italic ${previewOnly ? 'cursor-default' : 'cursor-move hover:fill-amber-500'}`}
                  onMouseDown={() => handleMouseDown('name')}
                >
                  {effectiveName}
                </text>
              )}

              {/* Number on Back - DRAGGABLE */}
              {(config.numberType === 'back' || config.numberType === 'both' || config.numberType === 'front') && effectiveNumber && (
                <text
                  x="100"
                  y={`${config.numberPosition.y}%`}
                  textAnchor="middle"
                  fontFamily={config.numberFont}
                  fontSize={96 * config.numberScale}
                  fontWeight="black"
                  fill={config.numberColor}
                  stroke={config.numberOutlineColor}
                  strokeWidth={config.numberOutlineWidth * 2}
                  className={`${previewOnly ? 'cursor-default' : 'cursor-move hover:fill-amber-500'}`}
                  onMouseDown={() => handleMouseDown('number')}
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
            className={`absolute ${dragTarget === 'logo' ? 'scale-110' : ''} ${previewOnly ? 'cursor-default' : 'cursor-move'}`}
            style={{
              left: `${config.logoPosition.x}%`,
              top: `${config.logoPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${config.logoScale})`,
              zIndex: 40,
            }}
            onMouseDown={() => handleMouseDown('logo')}
          >
            {!previewOnly && (
               <div className="absolute inset-0 border border-amber-500/20 rounded scale-150 opacity-0 group-hover:opacity-100 animate-pulse" />
            )}
            <img 
              src={config.logoImage} 
              alt="Custom Logo" 
              className="max-w-20 max-h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              draggable={false}
            />
          </div>
        )}
      </div>
      
      {/* HUD Info */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1">
        <div className="flex gap-2 mb-2">
            <div className="w-1 h-3 bg-white/20" />
            <div className="w-1 h-3 bg-white/10" />
            <div className="w-1 h-3 bg-amber-500/40" />
        </div>
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Sublimation Profile</span>
        <span className="text-xl font-black text-white italic uppercase tracking-tighter">{view} PHASE</span>
      </div>
      
      {/* Zone Indicators */}
      <div className="absolute bottom-6 left-6 flex gap-4">
        {[
            { label: 'Base', color: config.baseColor },
            { label: 'Sleeve', color: config.sleeveColor },
            { label: 'Yoke', color: config.yokeColor },
            { label: 'Side', color: config.sidePanelColor }
        ].map(zone => (
            <div key={zone.label} className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{zone.label}</span>
                <div className="w-6 h-1.5" style={{ backgroundColor: zone.color }} />
            </div>
        ))}
      </div>
    </div>
  );
}
