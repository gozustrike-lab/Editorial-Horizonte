'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { BookWithDetails } from '@/lib/types';

// Cover color palette — warm, literary tones
const coverColors = [
  'from-emerald-800 to-emerald-950',
  'from-amber-700 to-amber-900',
  'from-rose-800 to-rose-950',
  'from-sky-800 to-sky-950',
  'from-violet-800 to-violet-950',
  'from-teal-700 to-teal-900',
  'from-orange-700 to-orange-900',
  'from-pink-800 to-pink-950',
  'from-cyan-800 to-cyan-950',
  'from-lime-800 to-lime-950',
  'from-fuchsia-800 to-fuchsia-950',
  'from-indigo-800 to-indigo-950',
  'from-red-800 to-red-950',
  'from-yellow-700 to-yellow-900',
  'from-stone-700 to-stone-900',
];

function getCoverColor(bookId: string) {
  let hash = 0;
  for (let i = 0; i < bookId.length; i++) {
    hash = bookId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return coverColors[Math.abs(hash) % coverColors.length];
}

interface BookCardProps {
  book: BookWithDetails;
  featured?: boolean;
  onClick: () => void;
}

export function BookCard({ book, featured, onClick }: BookCardProps) {
  const { addToCart } = useAppStore();
  const colorClass = getCoverColor(book.id);
  const initial = book.title.charAt(0).toUpperCase();
  const authors = book.authors.map((a) => a.author.name).join(', ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`group cursor-pointer ${
        featured
          ? 'sm:col-span-2 sm:row-span-2'
          : ''
      }`}
      onClick={onClick}
    >
      <div className="relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        {/* Cover */}
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br ${colorClass} ${
            featured ? 'h-64 sm:h-80' : 'h-48 sm:h-56'
          }`}
        >
          <span className="font-serif text-6xl font-bold text-white/20 sm:text-7xl">
            {initial}
          </span>

          {book.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px]">
              Destacado
            </Badge>
          )}

          {book.originType === 'PROPIO' ? (
            <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-[10px]">
              Fondo Propio
            </Badge>
          ) : (
            <Badge variant="outline" className="absolute top-2 right-2 bg-white/90 text-[10px]">
              Tercero
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3
            className={`font-serif font-semibold leading-tight text-foreground ${
              featured ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
            }`}
          >
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {authors}
          </p>
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <span className="font-serif text-lg font-bold text-primary">
                ${book.price.toLocaleString('es-AR')}
              </span>
              {book.totalStock > 0 && book.totalStock <= 10 && (
                <span className="ml-2 text-[10px] text-amber-600">
                  ¡Últimas {book.totalStock} copias!
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="gap-1"
              disabled={book.totalStock === 0}
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  bookId: book.id,
                  title: book.title,
                  price: book.price,
                  originType: book.originType,
                });
              }}
            >
              <ShoppingCart className="size-3.5" />
              <span className="hidden sm:inline">Agregar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}