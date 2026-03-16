import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  user: User | null;
  isAuthReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'zora_bakes_cart';
const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.08; // 8%

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, isAuthReady } = useAuth();
  const [isSyncing, setIsSyncing] = useState(true);

  // 1. Listen to Auth State
  useEffect(() => {
    if (!isAuthReady) return;

    const syncCart = async () => {
      if (user) {
        // User logged in: Merge local cart with remote cart
        const localCart = getLocalCart();
        try {
          const cartRef = doc(db, 'carts', user.uid);
          const cartSnap = await getDoc(cartRef);
          
          let remoteItems: CartItem[] = [];
          if (cartSnap.exists()) {
            remoteItems = cartSnap.data().items || [];
          }

          // Merge logic: If local items exist, add them to remote (or overwrite if you prefer)
          // For simplicity, we will merge by adding quantities for matching IDs
          const mergedItems = [...remoteItems];
          localCart.forEach(localItem => {
            const existing = mergedItems.find(i => i.id === localItem.id);
            if (existing) {
              existing.quantity += localItem.quantity;
            } else {
              mergedItems.push(localItem);
            }
          });

          // Save merged cart to Firestore
          await setDoc(cartRef, {
            items: mergedItems,
            updatedAt: serverTimestamp()
          });

          // Clear local storage after merging
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setItems(mergedItems);

        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      } else {
        // User logged out: load from local storage
        setItems(getLocalCart());
      }
      setIsSyncing(false);
    };

    syncCart();
  }, [user, isAuthReady]);

  // 2. Listen to Firestore Cart changes (if logged in)
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const cartRef = doc(db, 'carts', user.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setItems(docSnap.data().items || []);
      } else {
        setItems([]);
      }
    }, (error) => {
      console.error("Firestore cart listener error:", error);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  // Helper to get local cart
  const getLocalCart = (): CartItem[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save cart (either to Firestore or LocalStorage)
  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);
    if (user) {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, {
          items: newItems,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const addItem = (newItem: CartItem) => {
    const existingItem = items.find(item => item.id === newItem.id);
    let updatedItems;
    if (existingItem) {
      updatedItems = items.map(item => 
        item.id === newItem.id 
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      updatedItems = [...items, newItem];
    }
    saveCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveCart(updatedItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 0 ? DELIVERY_FEE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryCharge + tax;

  return (
    <CartContext.Provider value={{
      items,
      subtotal,
      deliveryCharge,
      tax,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      user,
      isAuthReady
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
