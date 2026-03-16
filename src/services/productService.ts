import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
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
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, productData);
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
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
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
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time updates for all products
   */
  subscribeToProducts: (callback: (products: Product[]) => void) => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      callback(products);
    }, (error) => {
      console.error("Error subscribing to products:", error);
    });
  },

  /**
   * Updates the stock of a product
   */
  updateStock: async (productId: string, newStock: number): Promise<void> => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { stock: newStock });
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
};
