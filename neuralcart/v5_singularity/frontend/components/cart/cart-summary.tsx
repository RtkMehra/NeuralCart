"use client";

import { useCartStore, selectCartSummary } from '../../lib/cart-store';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export const CartSummary = () => {
  const { totalAmount, totalQuantity } = useCartStore(selectCartSummary);
  const clear = useCartStore((state) => state.clear);

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <Card className="space-y-3">
      <div>
        <p className="text-sm text-slate-400">Items</p>
        <p className="text-lg font-semibold text-slate-50">{totalQuantity}</p>
      </div>
      <div>
        <p className="text-sm text-slate-400">Order total</p>
        <p className="text-2xl font-semibold text-primary">${totalAmount.toFixed(2)}</p>
      </div>
      <Button variant="secondary" onClick={clear}>
        Clear cart
      </Button>
    </Card>
  );
};
