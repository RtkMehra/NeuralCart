import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AddToCartButton } from './add-to-cart-button';
import { type ProductSummary } from '../../lib/types';
import { cn } from '../../lib/utils';

export const ProductCard = ({ product, compact = false }: { product: ProductSummary; compact?: boolean }) => (
  <Card className={cn('flex h-full flex-col justify-between gap-4', compact ? 'p-5' : 'p-6')}>
    <div className="space-y-3">
      <Badge>{product.category.name}</Badge>
      <div>
        <h3 className="text-lg font-semibold text-slate-50">{product.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-400">{product.description}</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-sm text-slate-300">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500">Price</p>
        <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
      </div>
      <Link
        href={`/catalog/${product.id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-slate-400 transition hover:text-primary"
      >
        Details
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
    <AddToCartButton product={product} />
  </Card>
);
