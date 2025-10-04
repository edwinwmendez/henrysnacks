import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AnyCartItem, CartItem, Product, Combo, ComboCartItem } from '../types';
import { mockProducts } from '../data/mockData';

interface CartState {
  items: AnyCartItem[];
  isOpen: boolean;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedOptions: Record<string, string> } }
  | { type: 'ADD_COMBO'; payload: { combo: Combo; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { type: 'product' | 'combo'; id: string; selectedOptions?: Record<string, string> } }
  | { type: 'UPDATE_QUANTITY'; payload: { type: 'product' | 'combo'; id: string; quantity: number; selectedOptions?: Record<string, string> } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: AnyCartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, quantity: number, selectedOptions: Record<string, string>) => void;
  addComboToCart: (combo: Combo, quantity: number) => void;
  removeFromCart: (type: 'product' | 'combo', id: string, selectedOptions?: Record<string, string>) => void;
  updateQuantity: (type: 'product' | 'combo', id: string, quantity: number, selectedOptions?: Record<string, string>) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
} | null>(null);

function calculateItemPrice(product: Product, selectedOptions: Record<string, string>): number {
  let price = product.basePrice;

  product.options.forEach(option => {
    const selectedValue = selectedOptions[option.id];
    if (selectedValue) {
      const choice = option.options.find(opt => opt.id === selectedValue);
      if (choice) {
        price += choice.priceDelta;
      }
    }
  });

  return price;
}

function calculateComboPrice(combo: Combo): number {
  const regularPrice = combo.items.reduce((sum, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    return sum + (product?.basePrice || 0) * item.quantity;
  }, 0);
  return regularPrice * (1 - combo.discount_percentage / 100);
}

function calculateTotal(items: AnyCartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedOptions } = action.payload;
      const itemPrice = calculateItemPrice(product, selectedOptions);

      const existingItemIndex = state.items.findIndex(
        item => item.type === 'product' &&
                item.product.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );

      let newItems: AnyCartItem[];

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          type: 'product',
          product,
          quantity,
          selectedOptions,
          totalPrice: itemPrice
        };
        newItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true
      };
    }

    case 'ADD_COMBO': {
      const { combo, quantity } = action.payload;
      const comboPrice = calculateComboPrice(combo);

      const existingComboIndex = state.items.findIndex(
        item => item.type === 'combo' && item.combo.id === combo.id
      );

      let newItems: AnyCartItem[];

      if (existingComboIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingComboIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newComboItem: ComboCartItem = {
          type: 'combo',
          combo,
          quantity,
          totalPrice: comboPrice
        };
        newItems = [...state.items, newComboItem];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true
      };
    }

    case 'REMOVE_ITEM': {
      const { type, id, selectedOptions } = action.payload;
      const newItems = state.items.filter(item => {
        if (item.type === 'product' && type === 'product') {
          // Si se proporcionaron opciones, comparar también las opciones
          if (selectedOptions) {
            return !(item.product.id === id &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
          }
          // Si no se proporcionaron opciones, eliminar por ID solamente
          return item.product.id !== id;
        }
        if (item.type === 'combo' && type === 'combo') {
          return item.combo.id !== id;
        }
        return true;
      });

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { type, id, quantity, selectedOptions } = action.payload;

      const newItems = quantity <= 0
        ? state.items.filter(item => {
            if (item.type === 'product' && type === 'product') {
              // Si se proporcionaron opciones, comparar también las opciones
              if (selectedOptions) {
                return !(item.product.id === id &&
                        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
              }
              return item.product.id !== id;
            }
            if (item.type === 'combo' && type === 'combo') {
              return item.combo.id !== id;
            }
            return true;
          })
        : state.items.map(item => {
            if (item.type === 'product' && type === 'product') {
              // Si se proporcionaron opciones, comparar también las opciones
              if (selectedOptions) {
                if (item.product.id === id &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)) {
                  return { ...item, quantity };
                }
              } else if (item.product.id === id) {
                return { ...item, quantity };
              }
            }
            if (item.type === 'combo' && type === 'combo' && item.combo.id === id) {
              return { ...item, quantity };
            }
            return item;
          });

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload)
      };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0
};

const CART_STORAGE_KEY = 'amazonia-crujiente-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const cartItems: AnyCartItem[] = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      }
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      if (state.items.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [state.items]);

  const addToCart = (product: Product, quantity: number, selectedOptions: Record<string, string>) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedOptions } });
  };

  const addComboToCart = (combo: Combo, quantity: number) => {
    dispatch({ type: 'ADD_COMBO', payload: { combo, quantity } });
  };

  const removeFromCart = (type: 'product' | 'combo', id: string, selectedOptions?: Record<string, string>) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { type, id, selectedOptions } });
  };

  const updateQuantity = (type: 'product' | 'combo', id: string, quantity: number, selectedOptions?: Record<string, string>) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { type, id, quantity, selectedOptions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      addComboToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
