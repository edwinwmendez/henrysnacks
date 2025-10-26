import { ShoppingCart, Truck, Package } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "1. Elige tus productos",
      description: "Navega por nuestro catálogo de chifles, yuca y camote. Personaliza con tus opciones favoritas y agrega al carrito.",
      color: "from-[#F48C42] to-[#F3C64B]"
    },
    {
      icon: Package,
      title: "2. Realiza tu pedido",
      description: "Completa tu información de entrega. Aceptamos pago contra entrega para tu comodidad y seguridad.",
      color: "from-[#0B8A5F] to-[#0ea572]"
    },
    {
      icon: Truck,
      title: "3. Recibe en tu puerta",
      description: "Entregamos en 45 minutos promedio en Atalaya. Productos frescos y crujientes, directamente a tu hogar.",
      color: "from-[#5C3A21] to-[#7d5031]"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#FBFAF7] via-white to-[#FBFAF7]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#0B8A5F]/10 text-[#0B8A5F] rounded-full px-5 py-2.5 mb-4">
            <span className="text-sm font-semibold tracking-wide uppercase">
              Proceso simple
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            ¿Cómo Funciona?
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ordenar tus sabores amazónicos favoritos es fácil y rápido.
            En solo 3 simples pasos disfrutarás de tradición crujiente en tu hogar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connector Line (hidden on mobile, shown on desktop between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-[#F3C64B] to-transparent z-0" />
                )}

                {/* Card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#5C3A21] mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative element */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.color} opacity-5 rounded-bl-full`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-[#0B8A5F] mb-1">45min</div>
            <div className="text-sm text-gray-600">Entrega promedio</div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-[#0B8A5F] mb-1">100%</div>
            <div className="text-sm text-gray-600">Productos frescos</div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-[#0B8A5F] mb-1">Gratis</div>
            <div className="text-sm text-gray-600">Envío +S/50</div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-[#0B8A5F] mb-1">Seguro</div>
            <div className="text-sm text-gray-600">Pago contra entrega</div>
          </div>
        </div>
      </div>
    </section>
  );
}
