'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShoppingCart, BookOpen, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { BookWithDetails } from '@/lib/types';

const coverImages: Record<string, string> = {
  'el-aleph': 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&auto=format&fit=crop&q=75',
  'cien-anos-de-soledad': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=75',
  'la-casa-de-los-espiritus': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=75',
  'veinte-poemas-de-amor': 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&auto=format&fit=crop&q=75',
  'rayuela': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=75',
  'ficciones': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=75',
  'canto-general': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=75',
  'bestiario': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=75',
  'el-libro-de-los-abrazos': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=75',
  'eva-luna': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=75',
  'cronica-de-una-muerte-anunciada': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=75',
  'el-amor-en-los-tiempos-del-colera': 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&auto=format&fit=crop&q=75',
  'los-detectives-salvajes': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=75',
  'la-sombra-del-viento': 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&auto=format&fit=crop&q=75',
  'pedro-paramo': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=75',
};

const themeColors: Record<string, string> = {
  'el-aleph': '160 40% 18%',
  'cien-anos-de-soledad': '35 50% 22%',
  'la-casa-de-los-espiritus': '340 40% 20%',
  'veinte-poemas-de-amor': '350 45% 22%',
  'rayuela': '200 35% 20%',
  'ficciones': '160 35% 16%',
  'canto-general': '180 30% 18%',
  'bestiario': '150 40% 20%',
  'el-libro-de-los-abrazos': '30 50% 22%',
  'eva-luna': '20 45% 24%',
  'cronica-de-una-muerte-anunciada': '0 35% 20%',
  'el-amor-en-los-tiempos-del-colera': '280 30% 20%',
  'los-detectives-salvajes': '220 30% 18%',
  'la-sombra-del-viento': '260 35% 22%',
  'pedro-paramo': '15 40% 18%',
};

const defaultImage = 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&auto=format&fit=crop&q=75';

function getThemeColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return themeColors[slug] || `${(Math.abs(hash) % 360)} 35% 20%`;
}

interface BookCardProps {
  book: BookWithDetails;
  featured?: boolean;
  onClick: () => void;
}

const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  ({ className, book, onClick, ...props }, ref) => {
    const { addToCart } = useAppStore();
    const imageUrl = coverImages[book.slug] || defaultImage;
    const themeColor = getThemeColor(book.slug);
    const authors = book.authors.map((a) => a.author.name).join(', ');
    const originLabel = book.originType === 'PROPIO' ? 'Fondo Propio' : 'Terceros';
    const outOfStock = book.totalStock === 0;
    const lowStock = book.totalStock > 0 && book.totalStock <= 10;

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!outOfStock) {
        addToCart({
          bookId: book.id,
          title: book.title,
          price: book.price,
          originType: book.originType,
        });
      }
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn('group', className)}
        {...props}
      >
        <div
          style={{ '--theme-color': themeColor } as React.CSSProperties}
          className="relative cursor-pointer"
          onClick={onClick}
        >
          {/* Card container — aspect ratio for fluid responsiveness */}
          <div
            className={cn(
              'relative w-full overflow-hidden rounded-2xl',
              'transition-all duration-500 ease-out',
              'group-hover:shadow-[0_8px_40px_-12px_hsl(var(--theme-color)/0.45)]',
              'group-hover:scale-[1.02]',
              // Portrait aspect ratio — like a real book cover
              'aspect-[3/4] sm:aspect-[3/4.2]'
            )}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Gradient overlay — editorial style, stronger at bottom */}
            <div
              className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
              style={{
                background: `
                  linear-gradient(
                    to top,
                    hsl(var(--theme-color) / 0.95) 0%,
                    hsl(var(--theme-color) / 0.7) 30%,
                    hsl(var(--theme-color) / 0.25) 55%,
                    transparent 75%
                  )
                `,
              }}
            />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm border border-white/10"
                style={{ background: `hsl(var(--theme-color) / 0.5)` }}
              >
                {originLabel}
              </span>
              {book.isFeatured && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/90 px-2 py-0.5 text-[9px] font-bold text-amber-950 backdrop-blur-sm">
                  <Star className="size-2.5 fill-current" />
                  Destacado
                </span>
              )}
            </div>

            {/* Content — anchored to bottom with flex */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
              {/* Title — clamped for consistency */}
              <h3 className="font-serif font-bold leading-snug text-white text-lg sm:text-xl line-clamp-2">
                {book.title}
              </h3>

              {/* Author — single line */}
              <p className="mt-1 text-sm text-white/70 line-clamp-1 font-medium">
                {authors}
              </p>

              {/* Price row */}
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    ${book.price.toLocaleString('es-AR')}
                  </span>
                  {lowStock && (
                    <span className="text-[10px] font-medium text-amber-300/90">
                      ¡Últimas {book.totalStock}!
                    </span>
                  )}
                </div>

                {/* Cart button — compact, always visible on mobile, scales on hover desktop */}
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide',
                    'transition-all duration-300',
                    'backdrop-blur-md border',
                    // Hover: brighter bg
                    'group-hover:bg-[hsl(var(--theme-color)/0.45)] group-hover:border-[hsl(var(--theme-color)/0.5)]',
                    // Disabled state
                    outOfStock
                      ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-[hsl(var(--theme-color)/0.3)] border-[hsl(var(--theme-color)/0.35)] text-white/90 hover:text-white active:scale-95'
                  )}
                  style={!outOfStock ? {
                    background: `hsl(var(--theme-color) / 0.3)`,
                    borderColor: `hsl(var(--theme-color) / 0.35)`,
                  } : undefined}
                >
                  <ShoppingCart className="size-3.5" />
                  <span className="hidden xs:inline sm:inline">
                    {outOfStock ? 'Agotado' : 'Agregar'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
BookCard.displayName = 'BookCard';

export { BookCard };