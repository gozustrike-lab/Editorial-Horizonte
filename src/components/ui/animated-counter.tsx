'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useMotionValue,
  useSpring,
  useInView,
  animate,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState('0');
  const [blur, setBlur] = useState(4);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = performance.now();
      const duration = 2000;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * value);

        setDisplayValue(`${prefix}${current.toLocaleString('es-AR')}${suffix}`);
        setBlur(Math.max(0, 4 * (1 - eased)));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }
  }, [isInView, value, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={cn('tabular-nums', className)}
      style={{ filter: blur > 0.1 ? `blur(${blur}px)` : 'none' }}
    >
      {displayValue}
    </span>
  );
}