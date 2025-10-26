import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HowItWorks } from '../components/sections/HowItWorks';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

export function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HowItWorks />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
