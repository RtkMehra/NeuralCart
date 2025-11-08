'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createOrder } from '../lib/api';
import { useCartStore } from '../lib/cart-store';
import { formatCurrency } from '../lib/format-currency';
import type { User } from '../lib/types';

type CheckoutFormProps = {
  users: User[];
};

export const CheckoutForm = ({ users }: CheckoutFormProps) => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const [userId, setUserId] = useState(users[0]?.id ?? '');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!items.length) {
      setStatus('error');
      setErrorMessage('Add products to your cart before checking out.');
      return;
    }

    if (!userId) {
      setStatus('error');
      setErrorMessage('Select a user to associate with this order.');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('idle');
      setErrorMessage('');

      await createOrder({
        userId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      clearCart();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Checkout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40"
    >
      <div className="space-y-2">
        <label className="text-sm text-slate-300">Select profile</label>
        <select
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-primary focus:outline-none"
        >
          <option value="">Choose a customer</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-300">Order summary</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
        <span className="text-sm uppercase tracking-widest text-slate-400">
          Total
        </span>
        <span className="text-2xl font-semibold text-primary">
          {formatCurrency(Number(total.toFixed(2)))}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Processing...' : 'Place order'}
      </button>

      {status === 'success' && (
        <p className="rounded-lg border border-emerald-600 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Order placed successfully! Explore the dashboard or create another order.
        </p>
      )}

      {status === 'error' && (
        <p className="rounded-lg border border-rose-600 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {errorMessage}
        </p>
      )}
    </form>
  );
};

