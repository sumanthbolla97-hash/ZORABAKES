import { collection, serverTimestamp, getDocs, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CartItem } from '../context/CartContext';
import { Address } from './addressService';

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  createdAt: any;
}

export const orderService = {
  /**
   * Creates a new order in Firestore and decrements stock
   */
  createOrder: async (
    userId: string,
    userEmail: string,
    items: CartItem[],
    totalAmount: number,
    shippingAddress: Address,
    paymentMethod: 'COD' = 'COD'
  ): Promise<string> => {
    try {
      if (!userId) throw new Error("User ID is required to create an order");
      if (!items || items.length === 0) throw new Error("Cart is empty");
      if (!shippingAddress) throw new Error("Shipping address is required");

      const batch = writeBatch(db);
      
      // 1. Create the order document
      const orderRef = doc(collection(db, 'orders'));
      const orderData = {
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed' as OrderStatus,
        createdAt: serverTimestamp()
      };
      batch.set(orderRef, orderData);

      // 2. Decrement stock for each item and create inventory logs
      for (const item of items) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
        
        if (!productSnap.exists()) {
          throw new Error(`Product ${item.name} not found`);
        }
        
        const currentStock = productSnap.data().stock;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        const newStock = currentStock - item.quantity;
        batch.update(productRef, { stock: newStock });

        // Create inventory log for the sale
        const logRef = doc(collection(db, 'inventory_logs'));
        batch.set(logRef, {
          productId: item.productId,
          productName: item.name,
          userId,
          userEmail,
          previousStock: currentStock,
          newStock: newStock,
          quantityChanged: -item.quantity,
          changeType: 'sale',
          reason: `Order placed: ${orderRef.id}`,
          createdAt: serverTimestamp()
        });
      }

      await batch.commit();
      return orderRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  /**
   * Fetches all orders for a specific user
   */
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time updates for a user's orders
   */
  subscribeToUserOrders: (userId: string, callback: (orders: Order[]) => void) => {
    if (!userId) return () => {};

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to user orders:", error);
    });
  },

  /**
   * Updates the status of an order (Admin/System use)
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: status
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time updates for ALL orders (Admin only)
   */
  subscribeToAllOrders: (callback: (orders: Order[]) => void) => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to all orders:", error);
    });
  },

  /**
   * Updates the status of multiple orders (Admin/System use)
   */
  bulkUpdateOrderStatus: async (orderIds: string[], status: OrderStatus): Promise<void> => {
    try {
      const promises = orderIds.map(orderId => {
        const orderRef = doc(db, 'orders', orderId);
        return updateDoc(orderRef, { orderStatus: status });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error bulk updating order status:", error);
      throw error;
    }
  }
};
