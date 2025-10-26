import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CulturalSection } from '../components/sections/CulturalSection';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

export function HistoriaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <CulturalSection />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
