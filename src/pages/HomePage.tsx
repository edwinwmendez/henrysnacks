import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { Combos } from '../components/sections/Combos';
import { Testimonials } from '../components/sections/Testimonials';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Combos />
        <Testimonials />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
