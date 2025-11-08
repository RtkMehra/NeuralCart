import { Rocket, LineChart, ShoppingBag } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { type HealthReport } from '../lib/types';
import { ProductGrid } from '../components/products/product-grid';
import { SectionHeader } from '../components/common/section-header';
import { HealthStatusGrid } from '../components/observability/health-status-grid';
import { HealthDegradedCard } from '../components/observability/health-degraded-card';
import { KPICard } from '../components/observability/kpi-card';
import { Card } from '../components/ui/card';
import Link from 'next/link';

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const coerceToHealthReport = (input: unknown): HealthReport | null => {
  try {
    if (typeof input === 'string') {
      return coerceToHealthReport(JSON.parse(input));
    }

    if (
      input &&
      typeof input === 'object' &&
      'status' in input &&
      'dependencies' in input
    ) {
      return input as HealthReport;
    }

    return null;
  } catch {
    return null;
  }
};

export default async function HomePage() {
  let health: HealthReport | null = null;
  let healthError: ApiError | null = null;

  try {
    health = await api.getHealth();
  } catch (error) {
    healthError = error as ApiError;
  }

  const degradedReport = coerceToHealthReport(healthError?.payload);

  const productsPromise = api
    .listProducts({ limit: 6 })
    .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 6 } }));

  const ordersPromise = api
    .listOrders({ limit: 1 })
    .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 1 } }));

  const usersPromise = api
    .listUsers({ limit: 1 })
    .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 1 } }));

  const [products, orders, users] = await Promise.all([productsPromise, ordersPromise, usersPromise]);

  const productCount = products.meta.total;
  const orderCount = orders.meta.total;
  const userCount = users.meta.total;
  const topProducts = products.data.slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
              v5 • Singularity
            </p>
            <h1 className="text-4xl font-semibold text-slate-50">Operational intelligence for your commerce platform</h1>
            <p className="max-w-2xl text-sm text-slate-400">
              This dashboard pulls live data from the Singularity backend—catalog performance, search health, and recommendation readiness. Already wired for
              self-hosted environments with Redis, Elasticsearch, and Ollama running locally.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <Link href="/catalog" className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 hover:border-primary hover:text-primary">
                <ShoppingBag className="h-4 w-4" />
                Browse catalog
              </Link>
              <Link href="/observability" className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 hover:border-primary hover:text-primary">
                <LineChart className="h-4 w-4" />
                Observability suite
              </Link>
              <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 hover:border-primary hover:text-primary">
                <Rocket className="h-4 w-4" />
                Checkout flow
              </Link>
            </div>
          </div>
          <Card className="h-full max-w-sm space-y-4">
            <SectionHeader title="Platform KPIs" description="Snapshot generated from live services" />
            <div className="grid gap-3">
              <KPICard title="Products" value={formatNumber(productCount)} />
              <KPICard title="Active Orders" value={formatNumber(orderCount)} />
              <KPICard title="Accounts" value={formatNumber(userCount)} />
            </div>
            {healthError ? (
              <p className="text-xs text-amber-400">
                Degraded dependencies detected. Review the status panel below or open the Observability workspace for live metrics.
              </p>
            ) : null}
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader title="Platform health" description="Dependency readiness across core services." />
        {health ? (
          <HealthStatusGrid report={health} />
        ) : degradedReport ? (
          <HealthDegradedCard report={degradedReport} />
        ) : (
          <Card className="text-sm text-amber-300">
            Health status temporarily unavailable. Check Prometheus / Grafana to validate dependency uptime.
          </Card>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeader title="Trending products" description="Top movers from the catalog." />
        <ProductGrid products={topProducts} />
      </section>
    </div>
  );
}

