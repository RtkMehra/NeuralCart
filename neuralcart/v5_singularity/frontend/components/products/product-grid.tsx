import { type ProductSummary } from '../../lib/types';
import { ProductCard } from './product-card';

export const ProductGrid = ({ products }: { products: ProductSummary[] }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
