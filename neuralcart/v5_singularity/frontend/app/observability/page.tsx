import { api, ApiError } from '../../lib/api';
import { HealthStatusGrid } from '../../components/observability/health-status-grid';
import { HealthDegradedCard } from '../../components/observability/health-degraded-card';
import { SectionHeader } from '../../components/common/section-header';
import { Card } from '../../components/ui/card';
import { type HealthReport } from '../../lib/types';

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

export default async function ObservabilityPage() {
  let health: HealthReport | null = null;
  let healthError: ApiError | null = null;

  try {
    health = await api.getHealth();
  } catch (error) {
    healthError = error as ApiError;
  }

  const degradedReport = coerceToHealthReport(healthError?.payload);

  const products =
    health && !degradedReport
      ? await api
          .listProducts({ limit: 5 })
          .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 5 } }))
      : { data: [], meta: { total: 0, page: 1, limit: 5 } };

  const orders =
    health && !degradedReport
      ? await api
          .listOrders({ limit: 5 })
          .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 5 } }))
      : { data: [], meta: { total: 0, page: 1, limit: 5 } };

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Platform observability"
        description="Assess the readiness of each core dependency before launching the stack into production."
      />

      {health ? (
        <HealthStatusGrid report={health} />
      ) : degradedReport ? (
        <HealthDegradedCard report={degradedReport} />
      ) : (
        <Card className="text-sm text-amber-300">
          Health status temporarily unavailable. Check Prometheus / Grafana to validate dependency uptime.
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-slate-50">Operational guidance</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• Prometheus is bundled via docker-compose; access the dashboard at http://localhost:9090.</li>
            <li>• Grafana is provisioned with default dashboards on http://localhost:3001 (admin/admin).</li>
            <li>• Extend tracing by wiring an OTLP exporter. Search and recommendation services already expose latency histograms.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-50">Recent activity</h3>
          {health ? (
            <>
              <p className="mt-3 text-sm text-slate-400">
                {products.meta.total} products indexed • {orders.meta.total} orders in the system.
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500">Sample catalog entries</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {products.data.map((product) => (
                  <li key={product.id} className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <span className="text-slate-500">${product.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-amber-300">
              Product/order statistics paused while dependencies recover. Review dashboards and retry once services are online.
            </p>
          )}
        </Card>
      </section>
    </div>
  );
}
