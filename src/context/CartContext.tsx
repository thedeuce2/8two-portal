'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product, CustomJerseyConfig } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size?: string; color?: string; customConfig?: CustomJerseyConfig } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id && 
                item.size === action.payload.size &&
                item.color === action.payload.color &&
                JSON.stringify(item.customConfig) === JSON.stringify(action.payload.customConfig)
      );
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems, isOpen: true };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload }],
        isOpen: true,
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'CLEAR_CART':
      return { ...state, items: [], isOpen: false };
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, size?: string, color?: string, customConfig?: CustomJerseyConfig) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (product: Product, quantity: number, size?: string, color?: string, customConfig?: CustomJerseyConfig) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color, customConfig } });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const total = () => {
    return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };
  
  const itemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, toggleCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
