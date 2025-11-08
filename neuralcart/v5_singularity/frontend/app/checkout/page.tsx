import { CheckoutForm } from '../../components/checkout/checkout-form';
import { SectionHeader } from '../../components/common/section-header';
import { CartSummary } from '../../components/cart/cart-summary';

export default function CheckoutPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Checkout" description="Offline-first checkout flow ready for your payment provider." />
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <CheckoutForm />
        <CartSummary />
      </div>
    </div>
  );
}
