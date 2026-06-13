'use client';

import React from 'react';
import { Truck, BookOpen, Library, Heart } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const features = [
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    description:
      'Despachamos a Buenos Aires, Bogotá, CDMX y toda Latinoamérica.',
    counter: null,
  },
  {
    icon: BookOpen,
    title: 'Fondo Propio Exclusivo',
    description:
      'Títulos cuidadosamente editados con rigor crítico y pasión literaria.',
    counter: null,
  },
  {
    icon: Library,
    title: 'Catálogo Curado',
    description:
      'Cada obra seleccionada por nuestro equipo de editores especializados.',
    counter: { value: 2500, suffix: '+', label: 'títulos en catálogo' },
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description:
      'Asesoría literaria y recomendaciones personalizadas para cada lector.',
    counter: null,
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium tracking-widest text-primary uppercase">
            Nuestros pilares
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Más que una librería: un espacio dedicado a la literatura y la
            cultura latinoamericana.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <SpotlightCard
                key={feature.title}
                className="flex h-full flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {feature.counter && (
                  <div className="mt-4 pt-4 border-t border-border/50 w-full">
                    <AnimatedCounter
                      value={feature.counter.value}
                      suffix={feature.counter.suffix}
                      className="font-serif text-2xl font-bold text-primary"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {feature.counter.label}
                    </p>
                  </div>
                )}
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}