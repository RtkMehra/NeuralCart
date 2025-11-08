'use client';

import Link from 'next/link';
import { useCartStore } from '../../lib/cart-store';
import { formatCurrency } from '../../lib/format-currency';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );

  if (!items.length) {
    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-50">Your cart is empty</h1>
        <p className="text-sm text-slate-400">
          Browse the catalog and add something to your cart. Your selections persist
          locally using Zustand, so you can experiment offline.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          Explore products
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">Shopping cart</h1>
        <p className="text-sm text-slate-400">
          Adjust quantities or remove items before continuing to checkout.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 border-b border-slate-800 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-50">{item.name}</h2>
              <p className="text-sm text-slate-400">
                {formatCurrency(item.price)} each
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-slate-700">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-800"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="w-10 text-center text-sm text-slate-200">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-800"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="text-xs uppercase tracking-wide text-slate-400 hover:text-red-400"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Subtotal</p>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(Number(subtotal.toFixed(2)))}
          </p>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Proceed to checkout
        </Link>
      </div>
    </section>
  );
}

