'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/section-wrapper';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';

function CounterSimple({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = target;
    const step = Math.max(1, Math.floor(end / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-serif text-4xl font-bold text-primary sm:text-5xl">
      {val}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const stats = [
    {
      icon: <BookOpen className="size-6" />,
      value: 500,
      suffix: '+',
      label: 'Títulos',
    },
    {
      icon: <Calendar className="size-6" />,
      value: 15,
      suffix: '+',
      label: 'Años',
    },
    {
      icon: <Users className="size-6" />,
      value: 50,
      suffix: '+',
      label: 'Autores',
    },
    {
      icon: <Award className="size-6" />,
      value: 4,
      suffix: '',
      label: 'Puntos de venta',
    },
  ];

  return (
    <SectionWrapper id="nosotros" className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Nosotros
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Editorial Horizonte nació en 2011 de la pasión de Juan Damonte por la
            literatura latinoamericana. Lo que comenzó como un pequeño catálogo de
            reediciones cuidadas se ha convertido en una editorial y librería de
            referencia, con presencia en Buenos Aires, Bogotá y Ciudad de México.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Nuestra misión es hacer llegar al lector historias que trascienden:
            obras que desafían, conmueven y amplían los horizontes de la
            imaginación. Cada título en nuestro catálogo ha sido seleccionado con
            rigor y cariño.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center"
            >
              <div className="text-muted-foreground">{stat.icon}</div>
              <CounterSimple target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}