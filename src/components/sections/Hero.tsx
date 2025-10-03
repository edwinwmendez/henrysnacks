import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0B8A5F] via-[#0B8A5F] to-[#5C3A21] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FFFFFF%22 fill-opacity=%220.3%22%3E%3Cpath d=%22M30 30c0-16.569 13.431-30 30-30v60C43.431 60 30 46.569 30 30zM0 30c0-16.569 13.431-30 30-30v60C13.431 60 0 46.569 0 30z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="text-white space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2 text-[#F3C64B]">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Auténticos sabores amazónicos
              </span>
            </div>
            
            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Crujiente tradición de la 
                <span className="text-[#F3C64B] block">Amazonía</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Chifles, yuca y camote directo de la selva a tu mesa. 
                Sabores ancestrales preparados con técnicas tradicionales.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="flex items-center space-x-1 text-[#F3C64B] mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-white/80">500+ clientes felices</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F3C64B]">45min</p>
                <p className="text-sm text-white/80">Entrega promedio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F3C64B]">100%</p>
                <p className="text-sm text-white/80">Natural</p>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/catalogo">
                <Button size="lg" className="group bg-[#F3C64B] text-[#5C3A21] hover:bg-[#F3C64B]/90">
                  Ver Catálogo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#productos">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0B8A5F]">
                  Pedir Ahora
                </Button>
              </a>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg" 
                alt="Chifles y productos amazónicos" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#0B8A5F] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#5C3A21]">Preparando tu pedido</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#0B8A5F]">S/ 45</p>
                <p className="text-sm text-gray-600">Combo Selva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}