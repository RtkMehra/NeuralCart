"use client";

import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useCartStore, selectCartSummary } from '../../lib/cart-store';

export const CheckoutForm = () => {
  const clear = useCartStore((state) => state.clear);
  const { totalAmount, totalQuantity } = useCartStore(selectCartSummary);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    clear();
  };

  if (submitted) {
    return (
      <Card className="text-sm text-emerald-400">
        Order submitted! Because this stack is fully self-hosted, plug in your preferred payment and fulfillment providers to operationalise checkout.
      </Card>
    );
  }

  if (totalQuantity === 0) {
    return <Card className="text-sm text-slate-400">Add items to your cart before completing checkout.</Card>;
  }

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-widest text-slate-500">Company / team</label>
          <input
            className="h-11 rounded-lg border border-slate-800 bg-slate-950/80 px-4 text-sm text-slate-100 focus:border-primary focus:outline-none"
            required
            placeholder="Acme Robotics"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-widest text-slate-500">Contact email</label>
          <input
            type="email"
            className="h-11 rounded-lg border border-slate-800 bg-slate-950/80 px-4 text-sm text-slate-100 focus:border-primary focus:outline-none"
            required
            placeholder="team@acme.dev"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-widest text-slate-500">Shipping instructions</label>
          <textarea
            className="min-h-[120px] rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-primary focus:outline-none"
            placeholder="Include any delivery requirements or PO references."
          />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Total due</span>
          <span className="text-xl font-semibold text-primary">${totalAmount.toFixed(2)}</span>
        </div>
        <Button type="submit" className="w-full">
          Confirm order
        </Button>
      </form>
    </Card>
  );
};
