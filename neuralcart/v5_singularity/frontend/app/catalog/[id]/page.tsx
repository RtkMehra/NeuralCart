import { notFound } from 'next/navigation';
import { api, ApiError } from '../../../lib/api';
import { ProductHero } from '../../../components/products/product-hero';
import { RecommendationCarousel } from '../../../components/recommendations/recommendation-carousel';
import { SectionHeader } from '../../../components/common/section-header';
import { Card } from '../../../components/ui/card';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  try {
    const productResponse = await api.getProduct(params.id);
    const product = productResponse.data;
    const recommendations = await api
      .getRecommendations(product.id, 6)
      .then((res) => res.data)
      .catch(() => []);

    return (
      <div className="space-y-12">
        <ProductHero product={product} />

        <Card className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Category</p>
            <p className="text-sm text-slate-200">{product.category.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Stock status</p>
            <p className="text-sm text-slate-200">{product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Last updated</p>
            <p className="text-sm text-slate-200">{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        </Card>

        <section className="space-y-6">
          <SectionHeader title="Smart recommendations" description="Leveraging local embeddings via Ollama and pgvector." />
          <RecommendationCarousel recommendations={recommendations} />
        </section>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    const message = error instanceof ApiError ? error.message : 'Product details unavailable.';

    return (
      <Card className="space-y-3 border-amber-600/40 bg-amber-500/5 p-6 text-sm text-amber-200">
        <p className="font-semibold text-amber-300">Unable to load product</p>
        <p>{message}</p>
        <p className="text-xs text-amber-300/80">Check backend services and retry.</p>
      </Card>
    );
  }
}
