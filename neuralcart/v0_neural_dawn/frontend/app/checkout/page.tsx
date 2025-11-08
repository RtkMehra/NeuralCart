import Link from 'next/link';
import { CheckoutForm } from '../../components/checkout-form';
import { ErrorState } from '../../components/error-state';
import { fetchUsers } from '../../lib/api';

export default async function CheckoutPage() {
  try {
    const users = await fetchUsers();

    return (
      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-50">Checkout</h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Complete your Neural Dawn purchase locally. Orders are stored in PostgreSQL via
            TypeORM and visible immediately through the backend API.
          </p>
          <Link
            href="/cart"
            className="text-xs uppercase tracking-widest text-slate-400"
          >
            ← Review cart
          </Link>
        </div>
        <CheckoutForm users={users.data} />
      </section>
    );
  } catch (error) {
    return (
      <ErrorState
        description="The checkout service is temporarily unavailable. Please refresh once we reconnect."
        debugMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}

