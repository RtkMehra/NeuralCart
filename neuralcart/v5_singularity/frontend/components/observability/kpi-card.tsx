import { Card } from '../ui/card';

export const KPICard = ({ title, value, change }: { title: string; value: string; change?: string }) => (
  <Card className="space-y-2">
    <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
    <p className="text-3xl font-semibold text-slate-50">{value}</p>
    {change ? <p className="text-xs text-emerald-400">{change}</p> : null}
  </Card>
);
