'use client';

import Link from 'next/link';
import { useCartStore } from '../lib/cart-store';
import { formatCurrency } from '../lib/format-currency';
import type { Product } from '../lib/types';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-primary/70 hover:shadow-primary/30">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">
          {product.category.name}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-50">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-slate-400">
          {product.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Price
          </p>
          <p className="text-xl font-semibold text-primary">
            {formatCurrency(product.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1
            })
          }
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

