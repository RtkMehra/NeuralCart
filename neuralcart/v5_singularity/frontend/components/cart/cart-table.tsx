"use client";

import { Trash2 } from 'lucide-react';
import { useCartStore, selectCartSummary } from '../../lib/cart-store';
import { Button } from '../ui/button';

export const CartTable = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { totalAmount } = useCartStore(selectCartSummary);

  if (items.length === 0) {
    return <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">Cart is empty. Navigate to the catalog to add products.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">Subtotal</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 bg-slate-950/60 text-slate-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-50">{item.name}</div>
                  {item.imageUrl ? <p className="text-xs text-slate-500">SKU: {item.id}</p> : null}
                </td>
                <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/60">
                    <button
                      type="button"
                      className="px-3 py-2 text-slate-300 hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="min-w-[2rem] text-center text-slate-100">{item.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-2 text-slate-300 hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-end gap-2 text-sm text-slate-300">
        <p>
          <span className="text-slate-500">Order total:</span>{' '}
          <span className="text-lg font-semibold text-primary">${totalAmount.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};
