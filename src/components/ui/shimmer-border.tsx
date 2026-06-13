'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
}

export function ShimmerBorder({
  children,
  className,
  borderWidth = 1,
  duration = 4,
}: ShimmerBorderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        className
      )}
      style={{ padding: `${borderWidth}px` }}
    >
      {/* Rotating conic gradient — oversized so rotation doesn't show edges */}
      <div
        className="absolute inset-[-200%] animate-spin"
        style={{
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          background: `conic-gradient(
            oklch(0.40 0.07 160),
            oklch(0.55 0.10 160),
            oklch(0.75 0.14 75),
            oklch(0.55 0.10 160),
            oklch(0.40 0.07 160),
            transparent 50%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Inner content with solid background — creates the "border" illusion */}
      <div className="relative z-10 h-full w-full rounded-[calc(var(--radius)-1px)] bg-card">
        {children}
      </div>
    </div>
  );
}