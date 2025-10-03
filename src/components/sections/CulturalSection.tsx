import { Heart, Users, Leaf } from 'lucide-react';

export function CulturalSection() {
  const stories = [
    {
      title: "Tradición Shipibo",
      description: "Los patrones geométricos que inspiran nuestro diseño provienen del arte textil shipibo, reconocido por su precisión y belleza.",
      image: "https://images.pexels.com/photos/4321831/pexels-photo-4321831.jpeg",
      community: "Shipibo-Konibo"
    },
    {
      title: "Sabiduría Ashaninka",
      description: "Las técnicas de conservación y preparación de alimentos que utilizamos han sido transmitidas por generaciones ashaninka.",
      image: "https://images.pexels.com/photos/4916559/pexels-photo-4916559.jpeg",
      community: "Ashaninka"
    },
    {
      title: "Ingredientes Ancestrales",
      description: "Cada plátano, cada yuca, cada camote que utilizamos proviene de cultivos tradicionales de la Amazonía peruana.",
      image: "https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg",
      community: "Múltiples etnias"
    }
  ];

  return (
    <section id="historia" className="py-20 bg-gradient-to-br from-[#0B8A5F]/5 to-[#F3C64B]/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#0B8A5F] mb-4">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Con respeto y gratitud
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            Nuestra Herencia Cultural
          </h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Cada producto que preparamos lleva consigo siglos de sabiduría ancestral. 
            Honramos y celebramos las tradiciones culinarias de los pueblos originarios 
            de nuestra querida Amazonía peruana.
          </p>
        </div>
        
        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#F48C42]" />
                  <span className="text-sm font-medium text-[#F48C42]">
                    {story.community}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#5C3A21]">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cultural Commitment */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Leaf className="w-6 h-6 text-[#0B8A5F]" />
                <span className="text-sm font-medium text-[#0B8A5F] tracking-wide uppercase">
                  Nuestro Compromiso
                </span>
              </div>
              
              <h3 className="text-3xl font-bold text-[#5C3A21]">
                Más que sabor, es cultura
              </h3>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Trabajamos directamente con productores locales de comunidades amazónicas, 
                  asegurando precios justos y preservando métodos de cultivo tradicionales.
                </p>
                <p>
                  Parte de nuestras ganancias se destinan a programas de educación y 
                  preservación cultural en las comunidades que hacen posible nuestros productos.
                </p>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0B8A5F]">15</p>
                  <p className="text-sm text-gray-600">Comunidades aliadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0B8A5F]">100%</p>
                  <p className="text-sm text-gray-600">Comercio justo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0B8A5F]">3+</p>
                  <p className="text-sm text-gray-600">Años apoyando</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/4321831/pexels-photo-4321831.jpeg" 
                  alt="Comunidad amazónica" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <pattern id="cultural-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="#F3C64B" fillOpacity="0.3"/>
                    <circle cx="20" cy="20" r="3" fill="#0B8A5F" fillOpacity="0.5"/>
                  </pattern>
                  <rect width="200" height="200" fill="url(#cultural-pattern)"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}