"use client";

import { Button } from '../ui/button';
import { useCartStore } from '../../lib/cart-store';
import { type ProductSummary } from '../../lib/types';

export const AddToCartButton = ({ product }: { product: ProductSummary }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      variant="primary"
      size="md"
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        })
      }
    >
      Add to cart
    </Button>
  );
};
