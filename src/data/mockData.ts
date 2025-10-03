import { Product, Order } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Chifles Plátano Verde - Tradicional',
    slug: 'chifles-verde-tradicional',
    category: 'chifles-verde',
    description: 'Crujientes chifles de plátano verde, preparados con la receta tradicional de nuestras comunidades amazónicas.',
    price: 12,
    basePrice: 12,
    images: [
      'https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg',
      'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg'
    ],
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        type: 'size',
        options: [
          { id: 'small', name: '200g', priceDelta: 0 },
          { id: 'medium', name: '350g', priceDelta: 5 },
          { id: 'large', name: '500g', priceDelta: 8 }
        ]
      },
      {
        id: 'protein',
        name: 'Proteína',
        type: 'protein',
        options: [
          { id: 'none', name: 'Sin proteína', priceDelta: 0 },
          { id: 'pollo', name: 'Con pollo deshilachado', priceDelta: 8 },
          { id: 'chicharron', name: 'Con chicharrón', priceDelta: 10 }
        ]
      }
    ],
    tags: ['tradicional', 'crujiente', 'sin gluten'],
    ingredients: ['Plátano verde', 'Aceite vegetal', 'Sal marina'],
    featured: true,
    available: true
  },
  {
    id: '2',
    name: 'Chifles Plátano Maduro - Dulce Natural',
    slug: 'chifles-maduro-dulce',
    category: 'chifles-maduro',
    description: 'Dulces chifles de plátano maduro, con el sabor natural y la textura perfecta que tanto te gusta.',
    price: 14,
    basePrice: 14,
    images: [
      'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      'https://images.pexels.com/photos/1633572/pexels-photo-1633572.jpeg'
    ],
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        type: 'size',
        options: [
          { id: 'small', name: '200g', priceDelta: 0 },
          { id: 'medium', name: '350g', priceDelta: 6 },
          { id: 'large', name: '500g', priceDelta: 10 }
        ]
      }
    ],
    tags: ['dulce', 'natural', 'sin conservantes'],
    ingredients: ['Plátano maduro', 'Aceite de coco', 'Sal marina'],
    featured: true,
    available: true
  },
  {
    id: '3',
    name: 'Yuca Frita - Porción Familiar',
    slug: 'yuca-frita-familiar',
    category: 'yuca',
    description: 'Yuca fresca de la selva, cortada y frita a la perfección. Ideal para compartir en familia.',
    price: 16,
    basePrice: 16,
    images: [
      'https://images.pexels.com/photos/4516622/pexels-photo-4516622.jpeg',
      'https://images.pexels.com/photos/8879623/pexels-photo-8879623.jpeg'
    ],
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        type: 'size',
        options: [
          { id: 'individual', name: 'Individual', priceDelta: -6 },
          { id: 'familiar', name: 'Familiar', priceDelta: 0 },
          { id: 'xl', name: 'Extra Grande', priceDelta: 8 }
        ]
      },
      {
        id: 'protein',
        name: 'Acompañamiento',
        type: 'protein',
        options: [
          { id: 'none', name: 'Solo yuca', priceDelta: 0 },
          { id: 'pollo', name: 'Con pollo', priceDelta: 12 },
          { id: 'chicharron', name: 'Con chicharrón', priceDelta: 15 },
          { id: 'cecina', name: 'Con cecina', priceDelta: 18 }
        ]
      }
    ],
    tags: ['familiar', 'crujiente', 'tradicional'],
    ingredients: ['Yuca fresca', 'Aceite vegetal', 'Sal', 'Especias amazónicas'],
    featured: false,
    available: true
  },
  {
    id: '4',
    name: 'Camote Frito - Sabor Único',
    slug: 'camote-frito-unico',
    category: 'camote',
    description: 'Camote amazónico frito con un toque especial de hierbas y especias de la región.',
    price: 15,
    basePrice: 15,
    images: [
      'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg',
      'https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg'
    ],
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        type: 'size',
        options: [
          { id: 'small', name: 'Porción', priceDelta: -5 },
          { id: 'medium', name: 'Mediano', priceDelta: 0 },
          { id: 'large', name: 'Grande', priceDelta: 7 }
        ]
      },
      {
        id: 'seasoning',
        name: 'Sazón',
        type: 'topping',
        options: [
          { id: 'natural', name: 'Natural', priceDelta: 0 },
          { id: 'spicy', name: 'Picante amazónico', priceDelta: 2 },
          { id: 'herbs', name: 'Con hierbas', priceDelta: 3 }
        ]
      }
    ],
    tags: ['dulce', 'nutritivo', 'especiado'],
    ingredients: ['Camote amazónico', 'Aceite vegetal', 'Sal marina', 'Hierbas amazónicas'],
    featured: false,
    available: true
  },
  {
    id: '5',
    name: 'Combo Selva - Completo',
    slug: 'combo-selva-completo',
    category: 'combo',
    description: 'La experiencia completa: chifles verdes, yuca frita, camote y pollo deshilachado. Perfecto para 2-3 personas.',
    price: 45,
    basePrice: 45,
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/4516622/pexels-photo-4516622.jpeg'
    ],
    options: [
      {
        id: 'protein',
        name: 'Proteína principal',
        type: 'protein',
        options: [
          { id: 'pollo', name: 'Pollo deshilachado', priceDelta: 0 },
          { id: 'chicharron', name: 'Chicharrón crujiente', priceDelta: 5 },
          { id: 'mixto', name: 'Mixto (pollo + chicharrón)', priceDelta: 8 }
        ]
      }
    ],
    tags: ['combo', 'familiar', 'completo', 'mejor valor'],
    ingredients: ['Chifles verdes', 'Yuca frita', 'Camote frito', 'Proteína a elección', 'Salsas caseras'],
    featured: true,
    available: true
  },
  {
    id: '6',
    name: 'Combo Tradicional',
    slug: 'combo-tradicional',
    category: 'combo',
    description: 'Chifles verdes y maduros con yuca frita. La combinación perfecta de sabores tradicionales.',
    price: 28,
    basePrice: 28,
    images: [
      'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      'https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg'
    ],
    options: [
      {
        id: 'size',
        name: 'Tamaño',
        type: 'size',
        options: [
          { id: 'regular', name: 'Regular', priceDelta: 0 },
          { id: 'grande', name: 'Grande', priceDelta: 10 }
        ]
      }
    ],
    tags: ['tradicional', 'combinación', 'popular'],
    ingredients: ['Chifles verdes y maduros', 'Yuca frita', 'Salsas tradicionales'],
    featured: true,
    available: true
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        selectedOptions: { size: 'medium', protein: 'pollo' },
        totalPrice: 34
      }
    ],
    total: 39,
    deliveryFee: 5,
    status: 'preparing',
    customerInfo: {
      name: 'María García',
      phone: '+51 987654321',
      address: 'Av. La Marina 2355',
      district: 'San Miguel',
      reference: 'Casa color verde, puerta marrón'
    },
    paymentMethod: 'efectivo',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '45-60 minutos'
  }
];

export const districts = [
  { name: 'San Miguel', deliveryFee: 5, available: true },
  { name: 'Magdalena', deliveryFee: 5, available: true },
  { name: 'Pueblo Libre', deliveryFee: 6, available: true },
  { name: 'Jesús María', deliveryFee: 6, available: true },
  { name: 'Lince', deliveryFee: 7, available: true },
  { name: 'La Victoria', deliveryFee: 8, available: true },
  { name: 'Lima Cercado', deliveryFee: 8, available: true },
  { name: 'San Isidro', deliveryFee: 7, available: true },
  { name: 'Miraflores', deliveryFee: 9, available: true },
  { name: 'Barranco', deliveryFee: 10, available: true }
];