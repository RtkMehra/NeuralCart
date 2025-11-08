import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuralCart',
  description: 'Self-hosted intelligent commerce engine'
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-xl font-semibold text-primary">
              NeuralCart
            </Link>
            <nav className="flex items-center gap-4 text-sm uppercase tracking-widest text-slate-300">
              <Link href="/">Products</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/checkout">Checkout</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-5xl px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

