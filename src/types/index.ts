export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'chifles-verde' | 'chifles-maduro' | 'yuca' | 'camote' | 'combo';
  description: string;
  price: number;
  basePrice: number;
  images: string[];
  options: ProductOption[];
  tags: string[];
  ingredients: string[];
  featured: boolean;
  available: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'size' | 'protein' | 'topping';
  options: OptionChoice[];
}

export interface OptionChoice {
  id: string;
  name: string;
  priceDelta: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: { [optionId: string]: string };
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: 'pending' | 'preparing' | 'en_camino' | 'entregado' | 'cancelado';
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    reference?: string;
  };
  paymentMethod: 'efectivo' | 'pago_movil';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'customer' | 'admin' | 'rider';
}