import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold text-slate-50">Resource not found</h1>
      <p className="max-w-md text-sm text-slate-400">
        The item you requested isn’t available in the Singularity dataset. It may have been archived or the identifier is incorrect.
      </p>
      <Button asChild>
        <Link href="/catalog">Return to catalog</Link>
      </Button>
    </div>
  );
}
