'use client';

import React, { useState, useRef } from 'react';
import { CustomJerseyConfig, JERSEY_DESIGNS } from '@/types';

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

  const effectiveName = previewOnly && playerName ? playerName : (config.useTeamNames ? '' : config.name);
  const effectiveNumber = previewOnly && playerNumber ? playerNumber : config.number;
  const design = JERSEY_DESIGNS.find(d => d.id === config.designId) || JERSEY_DESIGNS[0];
  const isBuilderDesign = config.designId.startsWith('builder-');

  const getColor = (zone: keyof typeof design.mapping) => {
    const key = design.mapping[zone];
    if (key === 'primary') return config.primaryColor;
    if (key === 'accent1') return config.accent1Color;
    return config.accent2Color;
  };

  const handleMouseDown = (target: DragTarget) => { if (previewOnly) return; setDragTarget(target); };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || previewOnly || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const constrainedX = Math.max(15, Math.min(85, x));
    const constrainedY = Math.max(10, Math.min(90, y));
    if (dragTarget === 'logo') onConfigChange?.({ logoPosition: { x: constrainedX, y: constrainedY } });
    else if (dragTarget === 'name') onConfigChange?.({ namePosition: { y: constrainedY } });
    else if (dragTarget === 'number') onConfigChange?.({ numberPosition: { y: constrainedY } });
    else if (dragTarget === 'teamName') onConfigChange?.({ teamNamePosition: { y: constrainedY } });
  };

  const scaleMap: Record<string, number> = { 'XS': 0.85, 'S': 0.9, 'M': 1.0, 'L': 1.1, 'XL': 1.2, '2XL': 1.3, '3XL': 1.4, '4XL': 1.5 };
  const scale = scaleMap[size] || 1.0;

  return (
    <div ref={containerRef} className="relative bg-zinc-950 rounded-lg p-8 overflow-hidden select-none border border-white/5 shadow-inner" style={{ minHeight: '600px' }} onMouseMove={handleMouseMove} onMouseUp={() => setDragTarget(null)} onMouseLeave={() => setDragTarget(null)}>
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Perspective Control</span>
        <div className="flex gap-1 bg-black/40 p-1 border border-white/10 rounded-sm">
            <button onClick={() => setView('front')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'front' ? 'bg-white text-black' : 'text-white/30 hover:text-white/60'}`}>Front</button>
            <button onClick={() => setView('back')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'back' ? 'bg-white text-black' : 'text-white/30 hover:text-white/60'}`}>Back</button>
        </div>
      </div>

      <div className="relative mx-auto transition-all duration-700" style={{ width: '320px', height: '420px', transform: `scale(${scale})`, transformOrigin: 'top center', marginTop: '60px' }}>
        <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <defs>
            <mask id="bodyMask"><image href="/patterns/CrewFront_Body.png" width="200" height="280" /></mask>
            <mask id="sleevesMask"><image href="/patterns/CrewFront_Sleeves.png" width="200" height="280" /></mask>
            <mask id="collarMask"><image href="/patterns/CrewFront_Neck.png" width="200" height="280" /></mask>
            <mask id="patternMask">{design.overlayImage && <image href={design.overlayImage} width="200" height="280" />}</mask>
            
            <mask id="jerseyMask">
                <path d="M30 60 L170 60 L170 260 L140 280 L60 280 L30 260 Z" fill="white" />
            </mask>
          </defs>

          {isBuilderDesign ? (
              <g>
                  {/* SLEEVES */}
                  <g mask="url(#sleevesMask)">
                      <rect width="200" height="280" fill={getColor('sleeve')} />
                  </g>
                  
                  {/* BODY */}
                  <g mask="url(#bodyMask)">
                      <rect width="200" height="280" fill={getColor('base')} />
                  </g>

                  {/* COLLAR */}
                  <g mask="url(#collarMask)">
                      <rect width="200" height="280" fill={getColor('collar')} />
                  </g>
                  
                  {/* OVERLAY PATTERN */}
                  {design.overlayImage && (
                      <g mask="url(#patternMask)">
                          <rect width="200" height="280" fill={design.overlayColor ? config[`${design.overlayColor}Color` as keyof CustomJerseyConfig] as string : getColor('yoke')} opacity={config.patternOpacity} />
                      </g>
                  )}
              </g>
          ) : (
              <g mask="url(#jerseyMask)">
                {/* Legacy SVG paths */}
                <path d="M30 120 L10 140 L10 260 L30 260 Z" fill={getColor('side')} />
                <path d="M170 120 L190 140 L190 260 L170 260 Z" fill={getColor('side')} />
                <path d="M30 60 L170 60 L170 260 L140 280 L60 280 L30 260 Z" fill={getColor('base')} />
                <path d="M30 60 L170 60 L170 100 L30 100 Z" fill={getColor('yoke')} />
                <path d="M30 120 L10 140 L10 180 L30 160 Z" fill={getColor('sleeve')} />
                <path d="M170 120 L190 140 L190 180 L170 160 Z" fill={getColor('sleeve')} />
                <path d="M70 60 A30 30 0 0 0 130 60 Z" fill={getColor('collar')} />
              </g>
          )}

          {/* DRAGGABLE ASSETS & TEXT */}
          <g transform={`translate(${config.logoPosition.x * 2}, ${config.logoPosition.y * 2.8}) scale(${config.logoScale})`}>
              {config.logoImage && <image href={config.logoImage} x="-20" y="-20" width="40" height="40" style={{ cursor: previewOnly ? 'default' : 'move' }} onMouseDown={() => handleMouseDown('logo')} />}
          </g>

          {/* NAME */}
          <text x="100" y={config.namePosition.y * 2.8} textAnchor="middle" fill={config.nameColor} style={{ font: config.nameFont, fontSize: `${config.nameScale * 12}px`, fontWeight: 'black', textTransform: 'uppercase', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('name')}>
              {effectiveName}
          </text>

          {/* NUMBER */}
          <text x="100" y={config.numberPosition.y * 2.8} textAnchor="middle" fill={config.numberColor} style={{ font: config.numberFont, fontSize: `${config.numberScale * 40}px`, fontWeight: 'black', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('number')}>
              {effectiveNumber}
          </text>
        </svg>
      </div>
    </div>
  );
}
