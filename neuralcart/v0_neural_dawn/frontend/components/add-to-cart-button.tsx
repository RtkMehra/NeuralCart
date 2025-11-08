'use client';

import { useCartStore } from '../lib/cart-store';

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
};

export const AddToCartButton = ({
  productId,
  name,
  price
}: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          id: productId,
          name,
          price,
          quantity: 1
        })
      }
      className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
    >
      Add to cart
    </button>
  );
};

