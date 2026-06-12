'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero';
import { CatalogSection } from '@/components/catalog';
import { AboutSection } from '@/components/about';
import { AdminPanel } from '@/components/admin-panel';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { Footer } from '@/components/footer';

export default function Home() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <CatalogSection />
          <AboutSection />
          <AdminPanel />
        </main>
        <Footer />
        <CartPanel />
        <CheckoutDialog />
      </div>
    </QueryClientProvider>
  );
}