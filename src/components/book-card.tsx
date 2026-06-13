'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { BookWithDetails } from '@/lib/types';

// Unsplash cover images mapped by book slug — curated for literary atmosphere
const coverImages: Record<string, string> = {
  'el-aleph': 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&auto=format&fit=crop&q=70',
  'cien-anos-de-soledad': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=70',
  'la-casa-de-los-espiritus': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=70',
  'veinte-poemas-de-amor': 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&auto=format&fit=crop&q=70',
  'rayuela': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=70',
  'ficciones': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=70',
  'canto-general': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=70',
  'bestiario': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=70',
  'el-libro-de-los-abrazos': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=70',
  'eva-luna': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=70',
  'cronica-de-una-muerte-anunciada': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=70',
  'el-amor-en-los-tiempos-del-colera': 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format&fit=crop&q=70',
  'los-detectives-salvajes': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=70',
  'la-sombra-del-viento': 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600&auto=format&fit=crop&q=70',
  'pedro-paramo': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=70',
};

// Theme color per book — deep greens, ambers, and warm tones for editorial feel
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

const defaultImage = 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&auto=format&fit=crop&q=70';
const defaultColor = '160 40% 18%';

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
  ({ className, book, featured, onClick, ...props }, ref) => {
    const { addToCart } = useAppStore();
    const imageUrl = coverImages[book.slug] || defaultImage;
    const themeColor = getThemeColor(book.slug);
    const authors = book.authors.map((a) => a.author.name).join(', ');
    const categories = book.categories.map((c) => c.category.name).join(' / ');
    const originLabel = book.originType === 'PROPIO' ? 'Fondo Propio' : 'Tercera Editorial';

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'group w-full',
          featured ? 'sm:col-span-2 sm:row-span-2' : '',
          className
        )}
      >
        <div
          style={{ '--theme-color': themeColor } as React.CSSProperties}
          className="group w-full h-full cursor-pointer"
          {...props}
          onClick={onClick}
        >
          <div
            className={cn(
              'relative block w-full overflow-hidden rounded-2xl shadow-lg',
              'transition-all duration-500 ease-in-out',
              'group-hover:scale-[1.03] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.5)]',
              featured ? 'h-[420px] sm:h-[500px]' : 'h-[340px] sm:h-[400px]'
            )}
            style={{ boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.4)` }}
          >
            {/* Background Image with Parallax Zoom */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Themed Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, hsl(var(--theme-color) / 0.92), hsl(var(--theme-color) / 0.65) 35%, hsl(var(--theme-color) / 0.2) 60%, transparent 80%)`,
              }}
            />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm border border-white/15"
                style={{ background: `hsl(var(--theme-color) / 0.4)` }}
              >
                <BookOpen className="size-3" />
                {originLabel}
              </span>
              {book.isFeatured && (
                <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  Destacado
                </span>
              )}
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-end h-full p-5 text-white">
              {/* Price */}
              <div className="mb-2">
                <span className="text-2xl font-bold tracking-tight font-serif">
                  ${book.price.toLocaleString('es-AR')}
                </span>
                {book.totalStock > 0 && book.totalStock <= 10 && (
                  <span className="ml-2 text-xs text-amber-300">
                    ¡Últimas {book.totalStock}!
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className={cn(
                  'font-serif font-bold tracking-tight leading-tight',
                  featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                )}
              >
                {book.title}
              </h3>

              {/* Authors */}
              <p className="text-sm text-white/80 mt-1 font-medium">{authors}</p>

              {/* Categories */}
              {categories && (
                <p className="text-xs text-white/50 mt-0.5">{categories}</p>
              )}

              {/* Stock status */}
              {book.totalStock === 0 ? (
                <p className="mt-2 text-xs text-red-300 font-medium">Agotado</p>
              ) : (
                <p className="mt-2 text-xs text-white/50">
                  {book.totalStock} en stock
                </p>
              )}

              {/* Action button */}
              <div
                className="mt-4 flex items-center justify-between rounded-lg px-4 py-3 backdrop-blur-md border transition-all duration-300 group-hover:opacity-100"
                style={{
                  background: `hsl(var(--theme-color) / 0.25)`,
                  borderColor: `hsl(var(--theme-color) / 0.35)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (book.totalStock > 0) {
                    addToCart({
                      bookId: book.id,
                      title: book.title,
                      price: book.price,
                      originType: book.originType,
                    });
                  }
                }}
              >
                <span className="text-sm font-semibold tracking-wide flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {book.totalStock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </span>
                <ArrowRightIcon className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
BookCard.displayName = 'BookCard';

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export { BookCard };