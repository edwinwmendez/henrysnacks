import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "¿Cuáles son las zonas de delivery en Atalaya?",
      answer: "Realizamos entregas en Centro de Atalaya, Raymondi, Sepahua, Tahuania y Yurúa. El tiempo de entrega varía según la zona, con un promedio de 45 minutos."
    },
    {
      question: "¿Cuál es el monto mínimo de pedido?",
      answer: "El monto mínimo es de S/ 20. Para pedidos mayores a S/ 50, el envío es completamente gratis en todas nuestras zonas de cobertura."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Actualmente aceptamos pago contra entrega en efectivo. Pronto implementaremos pagos con Yape y transferencias bancarias para mayor comodidad."
    },
    {
      question: "¿Los productos son realmente frescos?",
      answer: "Sí, todos nuestros productos se preparan diariamente con ingredientes frescos de la Amazonía. Garantizamos 100% frescura y crocancia en cada entrega."
    },
    {
      question: "¿Puedo personalizar mi pedido?",
      answer: "¡Por supuesto! Puedes elegir el tamaño, tipo de proteína (pollo, cecina, sin proteína) y agregar toppings adicionales como salsa criolla o rocoto."
    },
    {
      question: "¿Tienen opciones sin gluten?",
      answer: "Sí, nuestros chifles de plátano verde y maduro, yuca frita y camote son naturalmente libres de gluten y preparados sin conservantes artificiales."
    },
    {
      question: "¿Cómo garantizan la calidad durante el delivery?",
      answer: "Empacamos cada producto en bolsas especiales que mantienen la temperatura y textura. Nuestros repartidores están capacitados para garantizar entregas rápidas y seguras."
    },
    {
      question: "¿Puedo hacer pedidos para eventos?",
      answer: "Sí, atendemos pedidos grandes para eventos familiares o corporativos. Contáctanos con 24 horas de anticipación al +51 987 654 321 para coordinar tu pedido especial."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#0B8A5F] mb-4">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Resolvemos tus dudas
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            Preguntas Frecuentes
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre nuestros productos y servicio de delivery.
            ¿No encuentras tu respuesta? Contáctanos directamente.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#FBFAF7] to-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#0B8A5F]/5 transition-colors duration-200"
              >
                <span className="font-semibold text-[#5C3A21] text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#0B8A5F] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#0B8A5F]/10 to-[#F3C64B]/10 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-[#5C3A21] mb-4">
            ¿Aún tienes dudas?
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nuestro equipo está listo para ayudarte. Contáctanos por WhatsApp, teléfono o email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/51987654321"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:+51987654321"
              className="inline-flex items-center px-6 py-3 bg-[#F48C42] hover:bg-[#e07a30] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
