import { ref, push, get, onValue, update, remove, serverTimestamp, set } from 'firebase/database';
import { rtdb } from '../firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  images: string[];
  ingredients: string[];
  stock: number;
  SKU: string;
  category: string;
  createdAt: any;
}

export const productService = {
  /**
   * Creates a new product in Firestore
   */
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const productsRef = ref(rtdb, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, {
        ...productData,
        createdAt: serverTimestamp()
      });
      return newProductRef.key as string;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Updates an existing product
   */
  updateProduct: async (productId: string, productData: Partial<Product>): Promise<void> => {
    try {
      const productRef = ref(rtdb, `products/${productId}`);
      await update(productRef, productData);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  /**
   * Deletes a product
   */
  deleteProduct: async (productId: string): Promise<void> => {
    try {
      const productRef = ref(rtdb, `products/${productId}`);
      await remove(productRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  /**
   * Fetches all products
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const productsRef = ref(rtdb, 'products');
      const snapshot = await get(productsRef);
      if (!snapshot.exists()) return [];

      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return products.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time updates for all products
   */
  subscribeToProducts: (callback: (products: Product[]) => void) => {
    const productsRef = ref(rtdb, 'products');
    return onValue(productsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(products.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error("Error subscribing to products:", error);
    });
  },

  /**
   * Updates the stock of a product
   */
  updateStock: async (productId: string, newStock: number): Promise<void> => {
    try {
      const productRef = ref(rtdb, `products/${productId}`);
      await update(productRef, { stock: newStock });
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
};
