"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CartIndicator } from './cart-indicator';

const links = [
  { href: '/' as Route, label: 'Overview' },
  { href: '/catalog' as Route, label: 'Catalog' },
  { href: '/search' as Route, label: 'Search' },
  { href: '/observability' as Route, label: 'Observability' },
  { href: '/checkout' as Route, label: 'Checkout' }
] as const;

export const MainNav = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-50">
          NeuralCart • Singularity
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition hover:text-primary',
                pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'text-primary' : 'text-slate-300'
              )}
            >
              {link.label}
            </Link>
          ))}
          <CartIndicator />
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900/60 p-2 text-slate-200 transition hover:border-primary hover:text-primary md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen ? (
        <div className="border-t border-slate-800 bg-slate-950/90 md:hidden">
          <div className="space-y-2 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm font-medium transition',
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-primary'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <CartIndicator />
          </div>
        </div>
      ) : null}
    </nav>
  );
};
