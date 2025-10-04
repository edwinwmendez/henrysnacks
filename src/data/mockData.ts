import { Product, Order, Combo } from '../types';

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
    featured: true,
    available: true
  }
];

// Combos - Bundles de productos con descuento
export const mockCombos: Combo[] = [
  {
    id: 'combo-1',
    name: 'Combo Selva - Completo',
    slug: 'combo-selva-completo',
    description: 'La experiencia completa: chifles verdes, yuca frita y camote. Perfecto para 2-3 personas.',
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/4516622/pexels-photo-4516622.jpeg'
    ],
    tags: ['familiar', 'completo', 'mejor valor'],
    items: [
      { product_id: '1', quantity: 1 }, // Chifles Verde
      { product_id: '3', quantity: 1 }, // Yuca
      { product_id: '4', quantity: 1 }  // Camote
    ],
    discount_percentage: 20,
    featured: true,
    available: true,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'combo-2',
    name: 'Combo Tradicional',
    slug: 'combo-tradicional',
    description: 'Chifles verdes y maduros con yuca frita. La combinación perfecta de sabores tradicionales.',
    images: [
      'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      'https://images.pexels.com/photos/5840219/pexels-photo-5840219.jpeg'
    ],
    tags: ['tradicional', 'popular', 'variado'],
    items: [
      { product_id: '1', quantity: 1 }, // Chifles Verde
      { product_id: '2', quantity: 1 }, // Chifles Maduro
      { product_id: '3', quantity: 1 }  // Yuca
    ],
    discount_percentage: 15,
    featured: true,
    available: true,
    createdAt: '2024-01-12T10:00:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        type: 'product',
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
      address: 'Jr. Rivas Arcos 234',
      district: 'Centro de Atalaya',
      reference: 'Casa color verde, puerta marrón'
    },
    paymentMethod: 'efectivo',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '45-60 minutos'
  },
  {
    id: 'ORD-002',
    items: [
      {
        type: 'product',
        product: mockProducts[0],
        quantity: 1,
        selectedOptions: { size: 'large', protein: 'chicharron' },
        totalPrice: 30
      },
      {
        type: 'product',
        product: mockProducts[1],
        quantity: 2,
        selectedOptions: { size: 'small' },
        totalPrice: 28
      }
    ],
    total: 86,
    deliveryFee: 5,
    status: 'en_camino',
    customerInfo: {
      name: 'Carlos Mendoza',
      phone: '+51 998877665',
      address: 'Jr. Pangoa 456',
      district: 'Centro de Atalaya',
      reference: 'Edificio azul, dpto 302'
    },
    paymentMethod: 'pago_movil',
    createdAt: '2024-01-15T11:15:00Z',
    estimatedDelivery: '15-20 minutos'
  },
  {
    id: 'ORD-003',
    items: [
      {
        type: 'product',
        product: mockProducts[2],
        quantity: 1,
        selectedOptions: { size: 'familiar', protein: 'cecina' },
        totalPrice: 34
      }
    ],
    total: 42,
    deliveryFee: 8,
    status: 'entregado',
    customerInfo: {
      name: 'Ana Rodríguez',
      phone: '+51 987123456',
      address: 'Jr. Ene 123',
      district: 'Raymondi',
      reference: 'Frente al parque'
    },
    paymentMethod: 'efectivo',
    createdAt: '2024-01-15T09:00:00Z',
    estimatedDelivery: 'Entregado'
  },
  {
    id: 'ORD-004',
    items: [
      {
        type: 'product',
        product: mockProducts[2],
        quantity: 2,
        selectedOptions: { size: 'familiar', protein: 'cecina' },
        totalPrice: 68
      }
    ],
    total: 85,
    deliveryFee: 9,
    status: 'entregado',
    customerInfo: {
      name: 'Luis Torres',
      phone: '+51 976543210',
      address: 'Jr. Ucayali 789',
      district: 'Centro de Atalaya',
      reference: 'Casa esquina, portón negro'
    },
    paymentMethod: 'pago_movil',
    createdAt: '2024-01-15T08:30:00Z',
    estimatedDelivery: 'Entregado'
  },
  {
    id: 'ORD-005',
    items: [
      {
        type: 'product',
        product: mockProducts[3],
        quantity: 3,
        selectedOptions: { size: 'medium', seasoning: 'spicy' },
        totalPrice: 51
      }
    ],
    total: 58,
    deliveryFee: 7,
    status: 'pending',
    customerInfo: {
      name: 'Patricia Vega',
      phone: '+51 965432109',
      address: 'Jr. Raymondi 202',
      district: 'Raymondi',
      reference: 'Al lado de la farmacia'
    },
    paymentMethod: 'efectivo',
    createdAt: '2024-01-15T12:00:00Z',
    estimatedDelivery: '50-65 minutos'
  },
  {
    id: 'ORD-006',
    items: [
      {
        type: 'product',
        product: mockProducts[0],
        quantity: 1,
        selectedOptions: { size: 'large', protein: 'chicharron' },
        totalPrice: 30
      },
      {
        type: 'product',
        product: mockProducts[1],
        quantity: 1,
        selectedOptions: { size: 'medium' },
        totalPrice: 20
      }
    ],
    total: 58,
    deliveryFee: 8,
    status: 'cancelado',
    customerInfo: {
      name: 'Roberto Díaz',
      phone: '+51 954321098',
      address: 'Jr. Iquitos 567',
      district: 'Centro de Atalaya',
      reference: 'Edificio comercial, oficina 5B'
    },
    paymentMethod: 'efectivo',
    createdAt: '2024-01-15T07:45:00Z',
    estimatedDelivery: 'Cancelado'
  },
  {
    id: 'ORD-007',
    items: [
      {
        type: 'product',
        product: mockProducts[3],
        quantity: 1,
        selectedOptions: { size: 'large', seasoning: 'spicy' },
        totalPrice: 24
      }
    ],
    total: 50,
    deliveryFee: 5,
    status: 'preparing',
    customerInfo: {
      name: 'Sofía Ramírez',
      phone: '+51 943210987',
      address: 'Jr. Ucayali 890',
      district: 'Centro de Atalaya',
      reference: 'Casa amarilla con jardín'
    },
    paymentMethod: 'pago_movil',
    createdAt: '2024-01-15T11:45:00Z',
    estimatedDelivery: '40-55 minutos'
  }
];

export const districts = [
  { name: 'Centro de Atalaya', deliveryFee: 5, available: true },
  { name: 'Raymondi', deliveryFee: 5, available: true },
  { name: 'Sepahua', deliveryFee: 8, available: true },
  { name: 'Tahuania', deliveryFee: 10, available: true },
  { name: 'Yurúa', deliveryFee: 12, available: true }
];

// Mock Users para UsersPage
export const mockUsers = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+51 987654321',
    role: 'customer' as const,
    createdAt: '2024-01-15T10:30:00Z',
    totalOrders: 12,
    totalSpent: 456
  },
  {
    id: '2',
    name: 'Admin Usuario',
    email: 'admin@henrysnacks.pe',
    phone: '+51 999888777',
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51 998877665',
    role: 'customer' as const,
    createdAt: '2024-01-10T08:15:00Z',
    totalOrders: 8,
    totalSpent: 342
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@yahoo.com',
    phone: '+51 987123456',
    role: 'customer' as const,
    createdAt: '2024-01-12T14:20:00Z',
    totalOrders: 15,
    totalSpent: 678
  },
  {
    id: '5',
    name: 'Luis Torres',
    email: 'luis.torres@hotmail.com',
    phone: '+51 976543210',
    role: 'customer' as const,
    createdAt: '2024-01-08T11:00:00Z',
    totalOrders: 6,
    totalSpent: 234
  },
  {
    id: '6',
    name: 'Patricia Vega',
    email: 'patricia.vega@outlook.com',
    phone: '+51 965432109',
    role: 'customer' as const,
    createdAt: '2024-01-14T16:45:00Z',
    totalOrders: 3,
    totalSpent: 156
  },
  {
    id: '7',
    name: 'Roberto Díaz',
    email: 'roberto.diaz@gmail.com',
    phone: '+51 954321098',
    role: 'customer' as const,
    createdAt: '2024-01-05T09:30:00Z',
    totalOrders: 10,
    totalSpent: 489
  },
  {
    id: '8',
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@gmail.com',
    phone: '+51 943210987',
    role: 'customer' as const,
    createdAt: '2024-01-11T12:00:00Z',
    totalOrders: 7,
    totalSpent: 312
  },
  {
    id: '9',
    name: 'Delivery Rider 1',
    email: 'rider1@henrysnacks.pe',
    phone: '+51 932109876',
    role: 'rider' as const,
    createdAt: '2024-01-03T07:00:00Z',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    id: '10',
    name: 'Delivery Rider 2',
    email: 'rider2@henrysnacks.pe',
    phone: '+51 921098765',
    role: 'rider' as const,
    createdAt: '2024-01-04T07:00:00Z',
    totalOrders: 0,
    totalSpent: 0
  }
];

// Mock Reports para ReportsPage
export const mockReports = {
  overview: {
    totalRevenue: 3847,
    totalOrders: 67,
    averageOrderValue: 57.4,
    topSellingProduct: 'Combo Selva - Completo',
    revenueGrowth: 12.5,
    ordersGrowth: 8.3
  },
  salesByDay: [
    { date: '2024-01-09', revenue: 420, orders: 8 },
    { date: '2024-01-10', revenue: 548, orders: 10 },
    { date: '2024-01-11', revenue: 612, orders: 11 },
    { date: '2024-01-12', revenue: 489, orders: 9 },
    { date: '2024-01-13', revenue: 734, orders: 13 },
    { date: '2024-01-14', revenue: 523, orders: 9 },
    { date: '2024-01-15', revenue: 521, orders: 7 }
  ],
  salesByProduct: [
    { productName: 'Combo Selva - Completo', quantity: 23, revenue: 1127 },
    { productName: 'Combo Tradicional', quantity: 18, revenue: 594 },
    { productName: 'Chifles Plátano Verde', quantity: 34, revenue: 578 },
    { productName: 'Yuca Frita - Porción Familiar', quantity: 28, revenue: 532 },
    { productName: 'Chifles Plátano Maduro', quantity: 26, revenue: 468 },
    { productName: 'Camote Frito - Sabor Único', quantity: 19, revenue: 342 }
  ],
  salesByDistrict: [
    { district: 'Centro de Atalaya', orders: 25, revenue: 1287 },
    { district: 'Raymondi', orders: 18, revenue: 834 },
    { district: 'Sepahua', orders: 12, revenue: 623 },
    { district: 'Tahuania', orders: 8, revenue: 456 },
    { district: 'Yurúa', orders: 4, revenue: 247 }
  ],
  topCustomers: [
    { name: 'Ana Rodríguez', orders: 15, totalSpent: 678 },
    { name: 'María García', orders: 12, totalSpent: 456 },
    { name: 'Roberto Díaz', orders: 10, totalSpent: 489 },
    { name: 'Carlos Mendoza', orders: 8, totalSpent: 342 },
    { name: 'Sofía Ramírez', orders: 7, totalSpent: 312 }
  ]
};