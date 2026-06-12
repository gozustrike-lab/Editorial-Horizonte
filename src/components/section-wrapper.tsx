'use client';

import { useEffect, useRef } from 'react';
import type { SectionType } from '@/lib/types';
import { useAppStore } from '@/lib/store';

interface SectionWrapperProps {
  id: SectionType;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const { setActiveSection } = useAppStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return (
    <section
      id={id}
      ref={ref}
      className={className}
    >
      {children}
    </section>
  );
}