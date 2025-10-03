import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { Combos } from '../components/sections/Combos';
import { CulturalSection } from '../components/sections/CulturalSection';
import { Testimonials } from '../components/sections/Testimonials';
import { CartDrawer } from '../components/cart/CartDrawer';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Combos />
        <CulturalSection />
        <Testimonials />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
