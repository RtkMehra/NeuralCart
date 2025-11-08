import { cn } from '../../lib/utils';

export const SectionHeader = ({
  title,
  description,
  className
}: {
  title: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn('flex flex-col gap-2', className)}>
    <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>
    {description ? <p className="text-sm text-slate-400">{description}</p> : null}
  </div>
);
