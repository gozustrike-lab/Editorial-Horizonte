'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255,255,255,0.08)',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-card p-6',
        'transition-colors duration-300',
        isHovered && 'border-primary/30',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Subtle border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-lg transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, oklch(0.40 0.07 160 / 0.08), transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}