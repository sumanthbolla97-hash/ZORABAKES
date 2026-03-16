import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot, doc, updateDoc, writeBatch, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface InventoryLog {
  id?: string;
  productId: string;
  productName: string;
  userId: string;
  userEmail: string;
  previousStock: number;
  newStock: number;
  quantityChanged: number;
  changeType: 'restock' | 'adjustment' | 'sale';
  reason?: string;
  createdAt: any;
}

export const inventoryService = {
  /**
   * Updates the stock of a product and creates an inventory log entry atomically
   */
  updateStockWithLog: async (
    productId: string,
    productName: string,
    previousStock: number,
    newStock: number,
    userId: string,
    userEmail: string,
    changeType: 'restock' | 'adjustment' | 'sale',
    reason?: string
  ): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // 1. Update product stock
      const productRef = doc(db, 'products', productId);
      batch.update(productRef, { stock: newStock });

      // 2. Create inventory log
      const logRef = doc(collection(db, 'inventory_logs'));
      batch.set(logRef, {
        productId,
        productName,
        userId,
        userEmail,
        previousStock,
        newStock,
        quantityChanged: newStock - previousStock,
        changeType,
        reason: reason || '',
        createdAt: serverTimestamp()
      });

      await batch.commit();
    } catch (error) {
      console.error("Error updating stock with log:", error);
      throw error;
    }
  },

  /**
   * Fetches inventory history for a specific product or all products
   */
  getInventoryHistory: async (productId?: string): Promise<InventoryLog[]> => {
    try {
      let q;
      if (productId) {
        q = query(
          collection(db, 'inventory_logs'),
          where('productId', '==', productId),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'inventory_logs'),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryLog[];
    } catch (error) {
      console.error("Error fetching inventory history:", error);
      throw error;
    }
  }
};
