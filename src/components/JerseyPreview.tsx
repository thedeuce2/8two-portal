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

type DragTarget = 'logo' | 'name' | 'number' | 'teamName' | 'frontText' | null;

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
    const constrainedX = Math.max(10, Math.min(90, x));
    const constrainedY = Math.max(10, Math.min(90, y));

    if (dragTarget === 'logo') onConfigChange?.({ logoPosition: { x: constrainedX, y: constrainedY } });
    else if (dragTarget === 'name') onConfigChange?.({ namePosition: { y: constrainedY } });
    else if (dragTarget === 'number') onConfigChange?.({ numberPosition: { y: constrainedY } });
    else if (dragTarget === 'teamName') onConfigChange?.({ teamNamePosition: { y: constrainedY } });
    else if (dragTarget === 'frontText') onConfigChange?.({ frontTextPosition: { x: constrainedX, y: constrainedY } });
  };

  const scaleMap: Record<string, number> = { 'XS': 0.85, 'S': 0.9, 'M': 1.0, 'L': 1.1, 'XL': 1.2, '2XL': 1.3, '3XL': 1.4, '4XL': 1.5 };
  const scale = scaleMap[size] || 1.0;

  const getLayerPath = (baseName: string) => {
    const isBack = view === 'back';
    if (baseName === 'Body') return isBack ? '/patterns/CrewBack_Body.png' : '/patterns/CrewFront_Body.png';
    if (baseName === 'Sleeves') return isBack ? '/patterns/CrewBack_Sleeves.png' : '/patterns/CrewFront_Sleeves.png';
    if (baseName === 'Neck') return isBack ? '/patterns/CrewBack_Neck.png' : '/patterns/CrewFront_Neck.png';
    // Stripes remain common for now
    if (baseName === 'Design1') return '/patterns/Design1_1.png';
    if (baseName === 'Design2') return '/patterns/Design1_2.png';
    return '';
  };

  // Arced Text Logic
  const renderArcedText = (text: string, x: number, y: number, color: string, font: string, fontSize: number, arc: 'none' | 'up' | 'down') => {
    if (!text) return null;
    if (arc === 'none') {
        return (
            <text x={x * 2} y={y * 2.8} textAnchor="middle" fill={color} style={{ font, fontSize: `${fontSize}px`, fontWeight: 'black', textTransform: 'uppercase', cursor: previewOnly ? 'default' : 'move' }} onMouseDown={() => handleMouseDown('frontText')}>
                {text}
            </text>
        );
    }

    const radius = 180;
    const isUp = arc === 'up';
    // Simple SVG Path Text for Arcs
    const pathId = `textArc_${isUp ? 'up' : 'down'}`;
    const pathD = isUp 
        ? `M ${x * 2 - 80},${y * 2.8 + 20} A ${radius},${radius} 0 0 1 ${x * 2 + 80},${y * 2.8 + 20}`
        : `M ${x * 2 - 80},${y * 2.8 - 20} A ${radius},${radius} 0 0 0 ${x * 2 + 80},${y * 2.8 - 20}`;

    return (
        <g onMouseDown={() => handleMouseDown('frontText')} style={{ cursor: previewOnly ? 'default' : 'move' }}>
            <defs><path id={pathId} d={pathD} /></defs>
            <text fill={color} style={{ font, fontSize: `${fontSize}px`, fontWeight: 'black', textTransform: 'uppercase' }}>
                <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">{text}</textPath>
            </text>
        </g>
    );
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
              {config.showSleeves && <image href={getLayerPath('Sleeves')} width="200" height="280" filter="url(#sleeveFilter)" opacity={config.sleeveOpacity} />}
              {config.showBody && <image href={getLayerPath('Body')} width="200" height="280" filter="url(#bodyFilter)" opacity={config.bodyOpacity} />}
              {config.showCollar && <image href={getLayerPath('Neck')} width="200" height="280" filter="url(#collarFilter)" opacity={config.collarOpacity} />}
              {config.showDesign1 && <image href={getLayerPath('Design1')} width="200" height="280" filter="url(#design1Filter)" opacity={config.design1Opacity} />}
              {config.showDesign2 && <image href={getLayerPath('Design2')} width="200" height="280" filter="url(#design2Filter)" opacity={config.design2Opacity} />}
          </g>

          {view === 'front' && (
            <>
              {/* FRONT LOGO */}
              <g transform={`translate(${(config.logoPosition?.x ?? 50) * 2}, ${(config.logoPosition?.y ?? 35) * 2.8}) scale(${config.logoScale})`}>
                  {config.logoImage && <image href={config.logoImage} x="-20" y="-20" width="40" height="40" style={{ cursor: previewOnly ? 'default' : 'move' }} onMouseDown={() => handleMouseDown('logo')} />}
              </g>
              
              {/* FRONT TEXT */}
              {renderArcedText(
                  config.frontText || '', 
                  config.frontTextPosition?.x ?? 50, 
                  config.frontTextPosition?.y ?? 45, 
                  config.frontTextColor || '#ffffff', 
                  config.frontTextFont || 'Arial Black, sans-serif', 
                  (config.frontTextScale ?? 1) * 16, 
                  config.frontTextArc || 'none'
              )}
            </>
          )}

          {view === 'back' && (
            <>
              {/* BACK NAME */}
              <text x="100" y={(config.namePosition?.y ?? 20) * 2.8} textAnchor="middle" fill={config.nameColor} style={{ font: config.nameFont, fontSize: `${(config.nameScale ?? 1) * 12}px`, fontWeight: 'black', textTransform: 'uppercase', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('name')}>
                  {effectiveName}
              </text>

              {/* BACK NUMBER */}
              <text x="100" y={(config.numberPosition?.y ?? 50) * 2.8} textAnchor="middle" fill={config.numberColor} style={{ font: config.numberFont, fontSize: `${(config.numberScale ?? 1) * 40}px`, fontWeight: 'black', cursor: previewOnly ? 'default' : 'ns-resize' }} onMouseDown={() => handleMouseDown('number')}>
                  {effectiveNumber}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
