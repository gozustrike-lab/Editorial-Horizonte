'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = 'left',
  speed = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const [animationDuration, setAnimationDuration] = useState('20s');
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef.current) {
      const w = innerRef.current.scrollWidth;
      if (w > 0) {
        setAnimationDuration(`${w / speed}s`);
      }
    }
  }, [speed, children]);

  const directionValue = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div
      className={cn('relative flex overflow-hidden', className)}
      role="marquee"
      aria-live="off"
    >
      {/* Left fade mask */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20"
        style={{
          background:
            'linear-gradient(to right, var(--color-background), transparent)',
        }}
        aria-hidden="true"
      />
      {/* Right fade mask */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20"
        style={{
          background:
            'linear-gradient(to left, var(--color-background), transparent)',
        }}
        aria-hidden="true"
      />

      <div
        className="flex shrink-0 items-center [&_[data-marquee-group]]:hover:[animation-play-state:paused]"
        style={
          {
            '--marquee-duration': animationDuration,
            '--marquee-direction': directionValue,
          } as React.CSSProperties
        }
      >
        <div
          ref={innerRef}
          data-marquee-group={pauseOnHover ? 'true' : undefined}
          className="flex shrink-0 items-center"
          style={{
            animation: `marquee-scroll var(--marquee-duration) linear infinite var(--marquee-direction)`,
          }}
        >
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}