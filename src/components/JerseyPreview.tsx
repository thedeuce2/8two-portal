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

  // Layer Path Logic based on View
  const getLayerPath = (baseName: string) => {
    const isBack = view === 'back';
    if (baseName === 'Body') return isBack ? '/patterns/CrewBack_Body.png' : '/patterns/CrewFront_Body.png';
    if (baseName === 'Sleeves') return isBack ? '/patterns/CrewBack_Sleeves.png' : '/patterns/CrewFront_Sleeves.png';
    if (baseName === 'Neck') return isBack ? '/patterns/CrewBack_Neck.png' : '/patterns/CrewFront_Neck.png';
    if (baseName === 'Design1') return isBack ? '/patterns/Design1_1.png' : '/patterns/Design1_1.png'; // Assuming same for now
    if (baseName === 'Design2') return isBack ? '/patterns/Design1_2.png' : '/patterns/Design1_2.png';
    return '';
  };

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
            <filter id="bodyFilter"><feFlood floodColor={config.bodyColor} result="flood" /><feComposite in="flood" in2="SourceAlpha" operator="in" /></filter>
            <filter id="sleeveFilter"><feFlood floodColor={config.sleeveColor} result="flood" /><feComposite in="flood" in2="SourceAlpha" operator="in" /></filter>
            <filter id="collarFilter"><feFlood floodColor={config.collarColor} result="flood" /><feComposite in="flood" in2="SourceAlpha" operator="in" /></filter>
            <filter id="design1Filter"><feFlood floodColor={config.design1Color} result="flood" /><feComposite in="flood" in2="SourceAlpha" operator="in" /></filter>
            <filter id="design2Filter"><feFlood floodColor={config.design2Color} result="flood" /><feComposite in="flood" in2="SourceAlpha" operator="in" /></filter>
          </defs>

          <g>
              {config.showSleeves && (
                  <image href={getLayerPath('Sleeves')} width="200" height="280" filter="url(#sleeveFilter)" opacity={config.sleeveOpacity} />
              )}
              
              {config.showBody && (
                  <image href={getLayerPath('Body')} width="200" height="280" filter="url(#bodyFilter)" opacity={config.bodyOpacity} />
              )}

              {config.showCollar && (
                  <image href={getLayerPath('Neck')} width="200" height="280" filter="url(#collarFilter)" opacity={config.collarOpacity} />
              )}
              
              {config.showDesign1 && (
                  <image href={getLayerPath('Design1')} width="200" height="280" filter="url(#design1Filter)" opacity={config.design1Opacity} />
              )}

              {config.showDesign2 && (
                  <image href={getLayerPath('Design2')} width="200" height="280" filter="url(#design2Filter)" opacity={config.design2Opacity} />
              )}
          </g>

          {/* DRAGGABLE ASSETS & TEXT (View Dependent) */}
          {view === 'front' && (
            <>
              <g transform={`translate(${config.logoPosition.x * 2}, ${config.logoPosition.y * 2.8}) scale(${config.logoScale})`}>
                  {config.logoImage && <image href={config.logoImage} x="-20" y="-20" width="40" height="40" style={{ cursor: previewOnly ? 'default' : 'move' }} onMouseDown={() => handleMouseDown('logo')} />}
              </g>
            </>
          )}

          {view === 'back' && (
            <>
              {/* NAME */}
              <text x="100" y={config.namePosition.y * 2.8} textAnchor="middle" fill={config.nameColor} style={{ font: config.nameFont, fontSize: `${config.nameScale * 12}px`, fontWeight: 'black', textTransform: 'uppercase', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('name')}>
                  {effectiveName}
              </text>

              {/* NUMBER */}
              <text x="100" y={config.numberPosition.y * 2.8} textAnchor="middle" fill={config.numberColor} style={{ font: config.numberFont, fontSize: `${config.numberScale * 40}px`, fontWeight: 'black', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('number')}>
                  {effectiveNumber}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
