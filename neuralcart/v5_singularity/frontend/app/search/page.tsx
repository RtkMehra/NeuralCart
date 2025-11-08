import { SearchPanel } from '../../components/search/search-panel';
import { SectionHeader } from '../../components/common/section-header';
import { api, ApiError } from '../../lib/api';
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

const buildDisabledMessage = (report: HealthReport | null, fallback: string) => {
  if (!report) {
    return fallback;
  }

  const offline = Object.entries(report.dependencies)
    .filter(([, status]) => status === 'down')
    .map(([name]) => name)
    .join(', ');

  return offline
    ? `Search pipeline paused while ${offline} recovers.`
    : fallback;
};

export default async function SearchPage() {
  let health: HealthReport | null = null;
  let healthError: ApiError | null = null;

  try {
    health = await api.getHealth();
  } catch (error) {
    healthError = error as ApiError;
  }

  const degradedReport = coerceToHealthReport(healthError?.payload);
  const disabledMessage = health
    ? undefined
    : buildDisabledMessage(degradedReport, healthError?.message ?? 'Search service unavailable.');

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Unified search"
        description="Powered by Elasticsearch with live indexing. Queries execute directly against the Singularity backend."
      />
      <SearchPanel disabledMessage={disabledMessage} />
    </div>
  );
}
