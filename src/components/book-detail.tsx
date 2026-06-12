'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, BookOpen, Calendar, Hash, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { BookWithDetails } from '@/lib/types';

// Same color function as BookCard
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

interface BookDetailProps {
  book: BookWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetail({ book, open, onOpenChange }: BookDetailProps) {
  const { addToCart } = useAppStore();

  if (!book) return null;

  const colorClass = getCoverColor(book.id);
  const initial = book.title.charAt(0).toUpperCase();
  const authors = book.authors.map((a) => a.author.name).join(', ');
  const categories = book.categories.map((c) => c.category.name).join(', ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{book.title}</DialogTitle>
          <DialogDescription>{authors}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          {/* Cover */}
          <div
            className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${colorClass} h-64 sm:h-auto`}
          >
            <span className="font-serif text-7xl font-bold text-white/20">
              {initial}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {book.originType === 'PROPIO' ? (
                <Badge>Fondo Propio</Badge>
              ) : (
                <Badge variant="outline">Tercero</Badge>
              )}
              {book.isFeatured && (
                <Badge className="bg-amber-500 text-white">Destacado</Badge>
              )}
              {book.categories.map((c) => (
                <Badge key={c.categoryId} variant="secondary">
                  {c.category.name}
                </Badge>
              ))}
            </div>

            {book.synopsis && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.synopsis}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {book.pages && (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {book.pages} páginas
                </div>
              )}
              {book.publicationYear && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {book.publicationYear}
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-1.5">
                  <Hash className="size-3.5" />
                  {book.isbn}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Globe className="size-3.5" />
                {book.language}
              </div>
            </div>

            {book.publisher && (
              <p className="text-xs text-muted-foreground">
                Editorial: {book.publisher.name}
                {book.publisher.country && ` (${book.publisher.country})`}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Stock disponible: <strong className="text-foreground">{book.totalStock}</strong></span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl font-bold text-primary">
              ${book.price.toLocaleString('es-AR')}
            </span>
          </div>
          <Button
            className="gap-2"
            disabled={book.totalStock === 0}
            onClick={() => {
              addToCart({
                bookId: book.id,
                title: book.title,
                price: book.price,
                originType: book.originType,
              });
              onOpenChange(false);
            }}
          >
            <ShoppingCart className="size-4" />
            Agregar al carrito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}