import { AlertTriangle, ServerCrash } from 'lucide-react';
import { HealthReport } from '../../lib/types';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

const dependencyStyles: Record<'up' | 'down' | 'unknown', string> = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  unknown: 'text-slate-400'
};

export const HealthDegradedCard = ({ report }: { report: HealthReport }) => {
  const entries = Object.entries(report.dependencies);

  return (
    <Card className="space-y-4 border-amber-600/40 bg-amber-500/5 p-6">
      <div className="flex items-center gap-3 text-amber-400">
        <AlertTriangle className="h-5 w-5" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest">Backend health degraded</p>
          <p className="text-xs text-amber-300/80">Last update {new Date(report.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <p className="text-sm text-amber-100/90">
        Some core services are unavailable. Review the dependency status below and investigate via Prometheus or Grafana before promoting to production.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {entries.map(([dependency, status]) => (
          <div
            key={dependency}
            className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <ServerCrash className="h-4 w-4 text-amber-300/80" />
              <span className="capitalize text-amber-50">{dependency}</span>
            </div>
            <span className={cn('font-semibold uppercase tracking-widest', dependencyStyles[status])}>{status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
