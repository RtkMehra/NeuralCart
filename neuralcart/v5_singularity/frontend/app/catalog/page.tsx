import { api, ApiError } from '../../lib/api';
import { ProductGrid } from '../../components/products/product-grid';
import { SectionHeader } from '../../components/common/section-header';
import { Pagination } from '../../components/navigation/pagination';
import { Card } from '../../components/ui/card';

const PAGE_SIZE = 9;

type CatalogPageProps = {
  searchParams?: { page?: string };
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const currentPage = Math.max(Number(searchParams?.page ?? '1'), 1);

  try {
    const products = await api.listProducts({ page: currentPage, limit: PAGE_SIZE });

    return (
      <div className="space-y-8">
        <SectionHeader title="Product catalog" description="View the operational catalog backed by Singularity services." />
        <ProductGrid products={products.data} />
        <Pagination
          currentPage={currentPage}
          totalItems={products.meta.total}
          pageSize={PAGE_SIZE}
          basePath="/catalog"
        />
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Catalog service unavailable.';

    return (
      <Card className="space-y-3 border-amber-600/40 bg-amber-500/5 p-6 text-sm text-amber-200">
        <p className="font-semibold text-amber-300">Catalog temporarily unavailable</p>
        <p>{message}</p>
        <p className="text-xs text-amber-300/80">Retry after verifying backend dependencies are healthy.</p>
      </Card>
    );
  }
}
