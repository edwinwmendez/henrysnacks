import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Carmen Flores",
      location: "Centro de Atalaya",
      rating: 5,
      text: "Los chifles más ricos que he probado. El sabor auténtico de la selva, preparados con la receta tradicional. ¡Excelente calidad y entrega súper rápida!",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Roberto Vásquez",
      location: "Raymondi",
      rating: 5,
      text: "El Combo Selva es perfecto para compartir en familia. Los ingredientes son frescos y se nota la calidad. Definitivamente seguiré pidiendo.",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Ana Lucía Torres",
      location: "Barrio la Loma",
      rating: 5,
      text: "Me encanta que respeten las tradiciones culinarias amazónicas. Además de delicioso, es un producto con historia y cultura. ¡Recomendadísimo!",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop&crop=face"
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#F48C42] mb-4">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Testimonios
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            Lo que dicen nuestros clientes
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Más de 200 familias en Atalaya ya disfrutan de nuestros sabores amazónicos.
            Lee sus experiencias y únete a nuestra comunidad.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-[#FBFAF7] to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#0B8A5F] opacity-20" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#F3C64B] fill-current" />
                ))}
              </div>
              
              {/* Text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center space-x-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-[#5C3A21]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0B8A5F] mb-2">500+</p>
            <p className="text-gray-600">Clientes Felices</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0B8A5F] mb-2">4.9</p>
            <p className="text-gray-600">Calificación Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0B8A5F] mb-2">45min</p>
            <p className="text-gray-600">Tiempo de Entrega</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0B8A5F] mb-2">10</p>
            <p className="text-gray-600">Distritos Atendidos</p>
          </div>
        </div>
      </div>
    </section>
  );
}