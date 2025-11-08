"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore, selectCartSummary } from '../../lib/cart-store';
import { cn } from '../../lib/utils';

export const CartIndicator = () => {
  const { totalQuantity } = useCartStore(selectCartSummary);

  return (
    <Link
      href="/cart"
      className={cn(
        'relative inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-primary hover:text-primary'
      )}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Cart
      {totalQuantity > 0 ? (
        <span className="ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {totalQuantity}
        </span>
      ) : null}
    </Link>
  );
};
