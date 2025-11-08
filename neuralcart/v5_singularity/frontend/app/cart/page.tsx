import { CartTable } from '../../components/cart/cart-table';
import { CartSummary } from '../../components/cart/cart-summary';
import { SectionHeader } from '../../components/common/section-header';

export default function CartPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Your cart" description="Review selected items before checkout." />
      <CartTable />
      <CartSummary />
    </div>
  );
}
