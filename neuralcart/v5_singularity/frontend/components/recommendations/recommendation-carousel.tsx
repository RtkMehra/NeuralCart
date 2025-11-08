import Link from 'next/link';
import { type RecommendationResult } from '../../lib/types';
import { Card } from '../ui/card';

export const RecommendationCarousel = ({ recommendations }: { recommendations: RecommendationResult[] }) => {
  if (!recommendations.length) {
    return (
      <Card className="text-sm text-slate-400">
        No adjacent products yet. Keep enriching your catalog to improve recommendations.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recommendations.map((item) => (
        <Card key={item.id} className="space-y-3 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
            <span>{item.category.name}</span>
            <span className="text-primary">{(item.score * 100).toFixed(0)}% match</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-50">{item.name}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-slate-400">{item.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
            <Link href={`/catalog/${item.id}`} className="text-xs font-semibold uppercase tracking-widest text-primary">
              View
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
