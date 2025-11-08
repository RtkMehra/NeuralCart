import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((existingItem) => existingItem.id === item.id);

        if (existing) {
          set({
            items: items.map((existingItem) =>
              existingItem.id === item.id
                ? { ...existingItem, quantity: existingItem.quantity + item.quantity }
                : existingItem
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
          )
        }),
      clear: () => set({ items: [] })
    }),
    {
      name: 'neuralcart-singularity-cart'
    }
  )
);

export const selectCartSummary = (state: CartState) => {
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return { totalQuantity, totalAmount };
};
