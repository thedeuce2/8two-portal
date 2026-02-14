'use client';

import React, { useState, useRef } from 'react';
import { CustomJerseyConfig, ApprovedLogo, APPROVED_LOGOS } from '@/types';

interface JerseyPreviewProps {
  config: CustomJerseyConfig;
  size?: string;
  playerName?: string;
  playerNumber?: string;
  previewOnly?: boolean;
}

export default function JerseyPreview({ 
  config, 
  size = 'M', 
  playerName,
  playerNumber,
  previewOnly = false
}: JerseyPreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Effective values (player overrides shared design)
  const effectiveName = previewOnly && playerName ? playerName : (config.useTeamNames ? '' : config.name);
  const effectiveNumber = previewOnly && playerNumber ? playerNumber : config.number;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewOnly) return; // Don't allow dragging in preview-only mode
    setIsDragging(true);
    setDragStart({ x: e.clientX - config.logoPosition.x, y: e.clientY - config.logoPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || previewOnly) return;
    const newX = Math.max(0, Math.min(100, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(100, e.clientY - dragStart.y));
    console.log('Drag to:', newX, newY);
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
      className="relative bg-zinc-900 rounded-lg p-8 overflow-hidden"
      style={{ minHeight: '500px' }}
    >
      {/* Jersey Container */}
      <div 
        className="relative mx-auto transition-transform duration-300"
        style={{ 
          width: '280px',
          height: '380px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Jersey SVG */}
        <svg
          viewBox="0 0 200 280"
          className="w-full h-full drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}
        >
          {/* Main Jersey Body with Gradient for Depth */}
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
          
          {/* Collar with shadow */}
          <path
            d="M60 50 Q100 65 140 50"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M60 50 Q100 64 140 50"
            fill="none"
            stroke="black"
            strokeWidth="1"
            opacity="0.2"
          />
          
          {/* Sleeve Trim Left */}
          <path
            d="M10 80 L30 60"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Sleeve Trim Right */}
          <path
            d="M190 80 L170 60"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Side Stripes Left */}
          <path
            d="M30 120 L30 260"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="4"
            opacity="0.8"
          />
          
          {/* Side Stripes Right */}
          <path
            d="M170 120 L170 260"
            fill="none"
            stroke={config.trimColor}
            strokeWidth="4"
            opacity="0.8"
          />
          
          {/* Number on Front */}
          {(config.numberPosition === 'front' || config.numberPosition === 'both') && effectiveNumber && (
            <text
              x="100"
              y="130"
              textAnchor="middle"
              fontFamily={config.numberFont}
              fontSize="42"
              fontWeight="bold"
              fill={config.numberColor}
              stroke={config.trimColor}
              strokeWidth="1"
            >
              {effectiveNumber}
            </text>
          )}
          
          {/* Name on Front */}
          {effectiveName && (
            <text
              x="100"
              y="175"
              textAnchor="middle"
              fontFamily={config.nameFont}
              fontSize="16"
              fontWeight="bold"
              fill={config.nameColor}
              letterSpacing="2"
            >
              {effectiveName}
            </text>
          )}
        </svg>
        
        {/* Logo Overlay (Draggable) */}
        {config.logoImage && (
          <div
            className={`absolute cursor-move ${isDragging ? 'scale-110' : ''} ${previewOnly ? 'cursor-default' : ''}`}
            style={{
              left: `${config.logoPosition.x}%`,
              top: `${config.logoPosition.y}%`,
              transform: `translate(-50%, -50%) scale(${config.logoScale})`,
              zIndex: 10,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              src={config.logoImage} 
              alt="Custom Logo" 
              className="max-w-16 max-h-16 object-contain"
              draggable={false}
            />
          </div>
        )}
      </div>
      
      {/* Size Indicator */}
      <div className="absolute top-4 right-4 bg-zinc-800 text-white text-sm px-3 py-1 rounded">
        Size: {size}
      </div>
      
      {/* Color Swatches Preview */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: config.baseColor }} />
        <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: config.trimColor }} />
      </div>
    </div>
  );
}
