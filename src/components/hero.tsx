'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';

// Dynamic import for Three.js — client-only, no SSR
const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-animation').then((mod) => ({ default: mod.ShaderAnimation })),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> }
);

export function HeroSection() {
  const { setActiveSection } = useAppStore();

  const scrollToCatalog = () => {
    setActiveSection('catalogo');
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden"
    >
      {/* Shader animation background — loaded dynamically, no SSR */}
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>

      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <BookOpen className="size-4 text-white/80" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/80">
            Libreria y Editorial
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-2 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Historias que{' '}
          <span className="italic text-white/85">trascienden</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Descubre nuestra coleccion curada de literatura latinoamericana y
          universal. Mas de 500 titulos seleccionados con pasion y rigor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            onClick={scrollToCatalog}
            className="gap-2 bg-white px-8 font-semibold text-black hover:bg-white/90"
          >
            Explorar Catalogo
            <ArrowDown className="size-4" />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1"
          >
            <motion.div className="h-2 w-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade to cream background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </section>
  );
}