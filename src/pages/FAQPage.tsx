import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FAQ } from '../components/sections/FAQ';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

export function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
