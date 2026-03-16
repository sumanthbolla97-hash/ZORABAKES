import { ref, push, get, onValue, update, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';
import { rtdb } from '../firebase';
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

      const updates: any = {};
      
      // 1. Create the order document
      const orderRef = push(ref(rtdb, 'orders'));
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
      updates[`orders/${orderRef.key}`] = orderData;

      // 2. Decrement stock for each item and create inventory logs
      for (const item of items) {
        const productRef = ref(rtdb, `products/${item.id}`);
        const productSnap = await get(productRef);
        
        if (!productSnap.exists()) {
          throw new Error(`Product ${item.name} not found`);
        }
        
        const currentStock = productSnap.val().stock;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        const newStock = currentStock - item.quantity;
        updates[`products/${item.id}/stock`] = newStock;

        // Create inventory log for the sale
        const logRef = push(ref(rtdb, 'inventory_logs'));
        updates[`inventory_logs/${logRef.key}`] = {
          productId: item.id,
          productName: item.name,
          userId,
          userEmail,
          previousStock: currentStock,
          newStock: newStock,
          quantityChanged: -item.quantity,
          changeType: 'sale',
          reason: `Order placed: ${orderRef.key}`,
          createdAt: serverTimestamp()
        };
      }

      await update(ref(rtdb), updates);
      return orderRef.key as string;
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
      
      const q = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(userId));
      const snapshot = await get(q);
      
      if (!snapshot.exists()) return [];
      
      const orders: Order[] = [];
      snapshot.forEach((childSnapshot) => {
        orders.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      return orders.sort((a, b) => b.createdAt - a.createdAt);
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

    const q = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(userId));

    return onValue(q, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const orders: Order[] = [];
      snapshot.forEach((childSnapshot) => {
        orders.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      callback(orders.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error("Error subscribing to user orders:", error);
    });
  },

  /**
   * Updates the status of an order (Admin/System use)
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await update(orderRef, { orderStatus: status });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time updates for ALL orders (Admin only)
   */
  subscribeToAllOrders: (callback: (orders: Order[]) => void) => {
    const ordersRef = ref(rtdb, 'orders');

    return onValue(ordersRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const orders: Order[] = [];
      snapshot.forEach((childSnapshot) => {
        orders.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      callback(orders.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error("Error subscribing to all orders:", error);
    });
  },

  /**
   * Updates the status of multiple orders (Admin/System use)
   */
  bulkUpdateOrderStatus: async (orderIds: string[], status: OrderStatus): Promise<void> => {
    try {
      const updates: any = {};
      orderIds.forEach(orderId => {
        updates[`orders/${orderId}/orderStatus`] = status;
      });
      await update(ref(rtdb), updates);
    } catch (error) {
      console.error("Error bulk updating order status:", error);
      throw error;
    }
  }
};
