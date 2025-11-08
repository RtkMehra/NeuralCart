import { type ProductSummary } from '../../lib/types';
import { Badge } from '../ui/badge';
import { AddToCartButton } from './add-to-cart-button';

export const ProductHero = ({ product }: { product: ProductSummary }) => (
  <section className="space-y-6">
    <Badge>{product.category.name}</Badge>
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold text-slate-50">{product.name}</h1>
      <p className="max-w-3xl text-base text-slate-300">{product.description}</p>
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Price</p>
          <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Inventory</p>
          <p className="text-lg font-medium text-slate-200">{product.stock} units</p>
        </div>
      </div>
      <AddToCartButton product={product} />
    </div>
  </section>
);
