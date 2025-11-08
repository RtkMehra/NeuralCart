import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '../../lib/utils';

export const Pagination = ({ currentPage, totalItems, pageSize, basePath }: { currentPage: number; totalItems: number; pageSize: number; basePath: Route }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const prevPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, totalPages);

  return (
    <div className="flex items-center justify-between text-sm">
      <Link
        href={{ pathname: basePath, query: { page: prevPage } }}
        className={cn(
          'rounded-full border border-slate-800 px-4 py-2 text-slate-300 transition hover:border-primary hover:text-primary',
          currentPage === 1 && 'pointer-events-none opacity-40'
        )}
      >
        Previous
      </Link>
      <span className="text-xs uppercase tracking-widest text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={{ pathname: basePath, query: { page: nextPage } }}
        className={cn(
          'rounded-full border border-slate-800 px-4 py-2 text-slate-300 transition hover:border-primary hover:text-primary',
          currentPage === totalPages && 'pointer-events-none opacity-40'
        )}
      >
        Next
      </Link>
    </div>
  );
};
