import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '../../../components/add-to-cart-button';
import { ErrorState } from '../../../components/error-state';
import { fetchProduct, fetchProducts } from '../../../lib/api';
import { formatCurrency } from '../../../lib/format-currency';

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.data.map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
}

type ProductPageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  try {
    const productResponse = await fetchProduct(id);
    const product = productResponse.data;

    return (
      <article className="space-y-8">
        <Link href="/" className="text-sm text-slate-400">
          ← Back to products
        </Link>

        <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              {product.category.name}
            </p>
            <h1 className="text-4xl font-semibold text-slate-50">
              {product.name}
            </h1>
            <p className="text-slate-300">{product.description}</p>
          </div>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Price
            </p>
            <p className="mt-2 text-3xl font-semibold text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-6 text-sm text-slate-400">
              Stock available: <span className="font-semibold">{product.stock}</span>
            </p>
            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={product.price}
              />
            </div>
          </aside>
        </div>
      </article>
    );
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      notFound();
    }

    return (
      <ErrorState
        description="Product data is temporarily unavailable. Please refresh once we reconnect."
        debugMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}

