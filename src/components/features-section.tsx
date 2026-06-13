'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, BookOpen, Library, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Truck,
    title: 'Envíos a toda Latinoamérica',
    description: 'Despachamos a Buenos Aires, Bogotá, CDMX y más de 15 países de la región.',
    color: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: BookOpen,
    title: 'Fondo Propio Exclusivo',
    description: 'Títulos cuidadosamente editados con rigor crítico y pasión literaria.',
    color: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Library,
    title: 'Catálogo Curado',
    description: 'Obras seleccionadas por nuestro equipo de editores especializados.',
    color: 'from-sky-500/10 to-blue-500/5',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Asesoría literaria y recomendaciones para cada lector.',
    color: 'from-rose-500/10 to-pink-500/5',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-sm font-medium tracking-widest text-primary uppercase">
            Nuestros pilares
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Más que una librería: un espacio dedicado a la literatura y la cultura latinoamericana.
          </p>
        </motion.div>

        {/* Feature cards — 2x2 on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8',
                  'transition-all duration-500 ease-out',
                  'hover:shadow-lg hover:-translate-y-0.5',
                  'hover:border-primary/20'
                )}
              >
                {/* Subtle gradient background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                  feature.color
                )} />

                <div className="relative z-10">
                  <div className={cn(
                    'mb-4 flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                    'bg-muted',
                  )}>
                    <Icon className={cn('size-5', feature.iconColor)} />
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Más info</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}