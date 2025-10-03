import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#5C3A21] text-[#FBFAF7]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0B8A5F] to-[#F3C64B] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <h2 className="text-lg font-bold">Amazonía Crujiente</h2>
            </div>
            <p className="text-[#FBFAF7]/80 text-sm leading-relaxed">
              Sabores auténticos de la Amazonía peruana, preparados con amor y tradición ancestral.
            </p>
            <div className="flex space-x-4">
              <button className="text-[#FBFAF7]/70 hover:text-[#F3C64B] transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="text-[#FBFAF7]/70 hover:text-[#F3C64B] transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#F3C64B]">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#productos" className="text-[#FBFAF7]/80 hover:text-white transition-colors">Nuestros Productos</a></li>
              <li><a href="#combos" className="text-[#FBFAF7]/80 hover:text-white transition-colors">Combos Familiares</a></li>
              <li><a href="#historia" className="text-[#FBFAF7]/80 hover:text-white transition-colors">Nuestra Historia</a></li>
              <li><a href="#delivery" className="text-[#FBFAF7]/80 hover:text-white transition-colors">Zonas de Delivery</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-[#F3C64B]">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-[#FBFAF7]/80">
                <Phone className="w-4 h-4" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center space-x-2 text-[#FBFAF7]/80">
                <Mail className="w-4 h-4" />
                <span>pedidos@amazoniacrujiente.pe</span>
              </li>
              <li className="flex items-start space-x-2 text-[#FBFAF7]/80">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Lima Metropolitana<br />Delivery en 10 distritos</span>
              </li>
            </ul>
          </div>
          
          {/* Cultural Note */}
          <div>
            <h3 className="font-semibold mb-4 text-[#F3C64B]">Cultura Amazónica</h3>
            <p className="text-[#FBFAF7]/80 text-sm leading-relaxed">
              Honramos las tradiciones culinarias de las comunidades Shipibo, Ashaninka y otros pueblos originarios de nuestra Amazonía.
            </p>
          </div>
        </div>
        
        <div className="border-t border-[#FBFAF7]/20 mt-8 pt-8 text-center text-sm text-[#FBFAF7]/70">
          <p>&copy; 2024 Amazonía Crujiente. Todos los derechos reservados. Con respeto y gratitud a nuestros pueblos amazónicos.</p>
        </div>
      </div>
    </footer>
  );
}