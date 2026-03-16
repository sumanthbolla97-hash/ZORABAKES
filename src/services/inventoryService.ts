import { ref, push, get, update, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';
import { rtdb } from '../firebase';

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
      const updates: any = {};

      // 1. Update product stock
      updates[`products/${productId}/stock`] = newStock;

      // 2. Create inventory log
      const logRef = push(ref(rtdb, 'inventory_logs'));
      updates[`inventory_logs/${logRef.key}`] = {
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
      };

      await update(ref(rtdb), updates);
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
      let logsRef;
      if (productId) {
        logsRef = query(ref(rtdb, 'inventory_logs'), orderByChild('productId'), equalTo(productId));
      } else {
        logsRef = ref(rtdb, 'inventory_logs');
      }
      
      const snapshot = await get(logsRef);
      if (!snapshot.exists()) return [];

      const logs: InventoryLog[] = [];
      snapshot.forEach((childSnapshot) => {
        logs.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return logs.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Error fetching inventory history:", error);
      throw error;
    }
  }
};
