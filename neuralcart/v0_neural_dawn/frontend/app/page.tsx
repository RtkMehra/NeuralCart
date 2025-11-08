import { Suspense } from 'react';
import { ErrorState } from '../components/error-state';
import { ProductCard } from '../components/product-card';
import { fetchProducts } from '../lib/api';

const ProductsList = async () => {
  try {
    const result = await fetchProducts();

    if (!result.data.length) {
      return (
        <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
          No products available yet. Seed the database to get started.
        </p>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        {result.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        debugMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
};

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">
          From CRUD to Cognition
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Explore the Neural Dawn catalog — self-hosted commerce data served directly
          from the Express + TypeORM backend. Add items to your cart and experience the
          local-first checkout flow.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
            Loading products...
          </p>
        }
      >
        {/* @ts-expect-error Async Server Component */}
        <ProductsList />
      </Suspense>
    </section>
  );
}

