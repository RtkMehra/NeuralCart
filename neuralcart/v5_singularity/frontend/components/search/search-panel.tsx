"use client";

import { FormEvent, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { type SearchResult } from '../../lib/types';
import Link from 'next/link';
import { cn } from '../../lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export const SearchPanel = ({ disabledMessage }: { disabledMessage?: string }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabledMessage) {
      return;
    }
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }
      const json = (await response.json()) as { data: SearchResult[] };
      setResults(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {disabledMessage ? (
        <Card className="border-amber-600/40 bg-amber-500/5 p-6 text-sm text-amber-200">
          {disabledMessage}
        </Card>
      ) : null}
      <Card className="space-y-4">
        <form onSubmit={runSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="Search by product name or description..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={Boolean(disabledMessage)}
            />
          </div>
          <Button type="submit" className="md:w-36" disabled={disabledMessage !== undefined}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run search'}
          </Button>
        </form>
        {error && !disabledMessage ? <p className="text-sm text-rose-400">{error}</p> : null}
      </Card>

      <div className="space-y-3">
        {results.length === 0 && !loading && !error ? (
          <Card className="text-sm text-slate-400">Run your first query to explore the catalog index.</Card>
        ) : null}
        {results.map((item) => (
          <Card key={item.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
              <span>{item.category}</span>
              <span className="text-primary">{(item.score * 100).toFixed(0)}% relevance</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
                <Link href={`/catalog/${item.id}`} className="text-xs font-semibold uppercase tracking-widest text-primary">
                  View
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
