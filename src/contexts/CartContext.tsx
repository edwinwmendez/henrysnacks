import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedOptions: Record<string, string> } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, quantity: number, selectedOptions: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedOptions } = action.payload;
      const itemPrice = calculateItemPrice(product, selectedOptions);
      
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          product,
          quantity,
          selectedOptions,
          totalPrice: itemPrice
        }];
      }
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const newItems = quantity <= 0 
        ? state.items.filter(item => item.product.id !== productId)
        : state.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity }
              : item
          );
      
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
    
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addToCart = (product: Product, quantity: number, selectedOptions: Record<string, string>) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedOptions } });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
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