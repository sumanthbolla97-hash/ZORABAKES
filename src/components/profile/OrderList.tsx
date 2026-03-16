import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { orderService, Order, OrderStatus } from "../../services/orderService";
import { Package, Clock, CheckCircle2, Truck, XCircle, ChefHat, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STATUS_STEPS: OrderStatus[] = [
  'Confirmed',
  'Preparing',
  'Packed',
  'Out for Delivery',
  'Delivered'
];

export function OrderList() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = orderService.subscribeToUserOrders(user.uid, (fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="h-5 w-5" />;
      case 'Preparing': return <ChefHat className="h-5 w-5" />;
      case 'Packed': return <Package className="h-5 w-5" />;
      case 'Out for Delivery': return <Truck className="h-5 w-5" />;
      case 'Delivered': return <CheckCircle2 className="h-5 w-5" />;
      case 'Cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        img: item.img
      });
    });
    navigate('/cart');
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-zora-stone)]">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 text-center px-6 py-12 md:px-8 md:py-16">
        <Package className="h-16 w-16 mx-auto text-[var(--color-zora-stone)]/50 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)] mb-2">No Orders Yet</h2>
        <p className="text-[var(--color-zora-stone)]">You haven't placed any orders with us yet.</p>
        <Button onClick={() => navigate('/menu')} className="mt-6">Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        
        return (
          <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">
                    Order #{order.id?.slice(-6)?.toUpperCase() || 'UNKNOWN'}
                  </p>
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-[var(--color-zora-blush)] text-[var(--color-zora-ink)]'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-zora-stone)]">
                  {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : 'Processing...'}
                </p>
              </div>
              <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                <p className="font-serif text-xl font-bold text-[var(--color-zora-ink)] md:text-2xl">${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm font-medium text-[var(--color-zora-stone)]">{order.items.length} item(s)</p>
              </div>
            </div>

            {/* Live Tracking Timeline - Always show if active, hide if delivered/cancelled unless expanded */}
            {(isExpanded || (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled')) && (
              <div className="mb-8 mt-4">
                <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] mb-6">Live Tracking</h3>
                
                {order.orderStatus === 'Cancelled' ? (
                  <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                    <XCircle className="h-6 w-6" />
                    <span className="font-bold">This order was cancelled.</span>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-6 right-6 h-0.5 bg-[var(--color-zora-ink)]/10 z-0 hidden md:block"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6 md:gap-0">
                      {STATUS_STEPS.map((step, index) => {
                        const currentIndex = getStatusIndex(order.orderStatus);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        
                        return (
                          <div key={step} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 relative">
                            {/* Vertical line for mobile */}
                            {index !== STATUS_STEPS.length - 1 && (
                              <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-[var(--color-zora-ink)]/10 md:hidden z-0"></div>
                            )}
                            
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 ${
                              isCompleted 
                                ? 'bg-[var(--color-zora-ink)] border-[var(--color-zora-ink)] text-white' 
                                : 'bg-white border-[var(--color-zora-ink)]/20 text-[var(--color-zora-stone)]'
                            } ${isCurrent ? 'ring-4 ring-[var(--color-zora-blush)]' : ''}`}>
                              {getStatusIcon(step)}
                            </div>
                            <div className="md:text-center">
                              <p className={`text-sm font-bold ${isCompleted ? 'text-[var(--color-zora-ink)]' : 'text-[var(--color-zora-stone)]'}`}>
                                {step}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-[var(--color-zora-ink)]/70 mt-0.5 animate-pulse">In Progress</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Expand/Collapse Details */}
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-zora-oat)] p-6 rounded-2xl mb-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-4">Items</h4>
                  <ul className="flex flex-col gap-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-center">
                        <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-[var(--color-zora-ink)] font-medium text-sm">{item.name}</p>
                          <p className="text-[var(--color-zora-stone)] text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-[var(--color-zora-ink)] font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-4">Delivery To</h4>
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-zora-ink)]/5">
                    <p className="text-sm font-bold text-[var(--color-zora-ink)] mb-1">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-[var(--color-zora-stone)]">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p className="text-sm text-[var(--color-zora-stone)]">{order.shippingAddress.addressLine2}</p>}
                    <p className="text-sm text-[var(--color-zora-stone)]">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p className="text-sm text-[var(--color-zora-stone)] mt-2 pt-2 border-t border-[var(--color-zora-ink)]/5">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                  
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)] mb-4 mt-6">Payment</h4>
                  <div className="bg-white p-4 rounded-xl border border-[var(--color-zora-ink)]/5 flex justify-between items-center">
                    <span className="text-sm text-[var(--color-zora-stone)]">Method</span>
                    <span className="text-sm font-bold text-[var(--color-zora-ink)]">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--color-zora-ink)]/10">
              <button 
                onClick={() => toggleDetails(order.id!)}
                className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors flex items-center gap-2"
              >
                {isExpanded ? (
                  <><ChevronUp className="h-4 w-4" /> Hide Details</>
                ) : (
                  <><ChevronDown className="h-4 w-4" /> View Details</>
                )}
              </button>
              
              <Button 
                onClick={() => handleReorder(order)} 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reorder Items
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
