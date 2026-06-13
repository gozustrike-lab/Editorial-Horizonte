'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';

const publishersRow1 = [
  'Editorial Horizonte · Fondo Propio',
  'Penguin Random House',
  'Alfaguara',
  'Sudamericana',
  'Emece',
];

const publishersRow2 = [
  'Debolsillo',
  'Planeta',
  'Anagrama',
  'Editorial Sudamericana',
  'Siglo XXI Editores',
];

function PublisherItem({ name }: { name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-6 py-2">
      <BookOpen className="h-4 w-4 text-muted-foreground/50" />
      <span className="whitespace-nowrap text-sm tracking-wide text-muted-foreground/70">
        {name}
      </span>
    </div>
  );
}

export function PublishersMarquee() {
  return (
    <section className="relative w-full overflow-hidden border-y border-border/50 bg-secondary/30 py-4">
      <div className="mb-2 flex flex-col gap-2">
        {/* Row 1 — scrolls left */}
        <Marquee direction="left" speed={30} pauseOnHover={false}>
          {publishersRow1.map((name) => (
            <PublisherItem key={`r1-${name}`} name={name} />
          ))}
        </Marquee>

        {/* Row 2 — scrolls right */}
        <Marquee direction="right" speed={25} pauseOnHover={false}>
          {publishersRow2.map((name) => (
            <PublisherItem key={`r2-${name}`} name={name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}