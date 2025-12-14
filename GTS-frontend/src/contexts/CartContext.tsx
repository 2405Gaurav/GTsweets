import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/api'; 

interface CartItem {
  _id: string;
  sweetId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category: string;
  };
  quantity: number;
  priceAtTime: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  cartSummary: CartSummary;
  loading: boolean;
  error: string | null;
  addToCart: (sweetId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeItem: (itemId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  checkout: () => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();
      setCart(response.cart);
      setCartSummary(response.summary);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      console.error('Error fetching cart:', axiosError);
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Failed to fetch cart';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartSummary({ itemCount: 0, subtotal: 0, tax: 0, total: 0 });
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (sweetId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.addItem(sweetId, quantity);
      setCart(response.cart);
      setCartSummary(response.summary);
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Failed to add to cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.updateItem(itemId, quantity);
      setCart(response.cart);
      setCartSummary(response.summary);
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Failed to update quantity';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.removeItem(itemId);
      setCart(response.cart);
      setCartSummary(response.summary);
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Failed to remove item';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.clearCart();
      setCart(response.cart);
      setCartSummary({ itemCount: 0, subtotal: 0, tax: 0, total: 0 });
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Failed to clear cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartApi.checkout();
      if (cart) {
        setCart({ ...cart, items: [], status: 'completed' });
      }
      setCartSummary({ itemCount: 0, subtotal: 0, tax: 0, total: 0 });
      return { success: true };
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Checkout failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    cartSummary,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};