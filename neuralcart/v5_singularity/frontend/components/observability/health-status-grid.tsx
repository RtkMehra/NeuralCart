import { HealthReport } from '../../lib/types';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

const statusStyles: Record<HealthReport['status'], string> = {
  ok: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  degraded: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  down: 'text-rose-400 border-rose-500/40 bg-rose-500/10'
};

const dependencyStyles: Record<'up' | 'down' | 'unknown', string> = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  unknown: 'text-slate-400'
};

export const HealthStatusGrid = ({ report }: { report: HealthReport }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-slate-500">Overall status</p>
      <span className={cn('inline-flex rounded-full border px-3 py-1 text-sm font-semibold', statusStyles[report.status])}>
        {report.status.toUpperCase()}
      </span>
      <p className="text-xs text-slate-500">Last updated {new Date(report.timestamp).toLocaleString()}</p>
    </Card>
    {Object.entries(report.dependencies).map(([dependency, status]) => (
      <Card key={dependency} className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">{dependency}</p>
          <p className="text-sm text-slate-300">{descriptionForDependency(dependency)}</p>
        </div>
        <span className={cn('text-sm font-semibold', dependencyStyles[status])}>{status.toUpperCase()}</span>
      </Card>
    ))}
  </div>
);

const descriptionForDependency = (dependency: string) => {
  switch (dependency) {
    case 'database':
      return 'PostgreSQL + TypeORM connectivity';
    case 'redis':
      return 'Redis cache latency & availability';
    case 'elasticsearch':
      return 'Product search index health';
    case 'ollama':
      return 'Local embedding generation service';
    default:
      return 'Managed dependency';
  }
};
