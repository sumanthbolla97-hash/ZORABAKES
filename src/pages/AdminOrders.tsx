import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { orderService, Order, OrderStatus } from "../services/orderService";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, ExternalLink, Filter, CheckSquare, Square } from "lucide-react";

const STATUS_OPTIONS: OrderStatus[] = [
  'Confirmed',
  'Preparing',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export function AdminOrders() {
  const { isAdmin, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  
  // Bulk selection
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("Confirmed");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAuthReady && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isAuthReady, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribe = orderService.subscribeToAllOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedOrderIds.size === 0) return;
    setIsUpdating(true);
    try {
      await orderService.bulkUpdateOrderStatus(Array.from(selectedOrderIds), bulkStatus);
      setSelectedOrderIds(new Set()); // Clear selection after success
    } catch (error) {
      alert("Failed to apply bulk update");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSelection = (orderId: string) => {
    const newSet = new Set(selectedOrderIds);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    setSelectedOrderIds(newSet);
  };

  const toggleAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map(o => o.id!)));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress.phone || "").includes(searchTerm);
    
    const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) return null;

  if (loading) {
    return <div className="text-center py-24 text-[var(--color-zora-stone)]">Loading admin panel...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-zora-ink)]">Admin Orders</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-zora-stone)]" />
            <input 
              type="text" 
              placeholder="Search ID, Name, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-zora-ink)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-zora-stone)]" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
              className="pl-10 pr-8 py-2 rounded-xl border border-[var(--color-zora-ink)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)] appearance-none bg-white"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOrderIds.size > 0 && (
        <div className="bg-[var(--color-zora-blush)] p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <span className="font-bold text-[var(--color-zora-ink)]">
            {selectedOrderIds.size} order(s) selected
          </span>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select 
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
              className="flex-1 sm:w-auto px-4 py-2 rounded-xl border border-[var(--color-zora-ink)]/20 focus:outline-none bg-white"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Button onClick={handleBulkUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Apply Status"}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--color-zora-ink)]/10 bg-[var(--color-zora-oat)]/50">
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleAll} className="text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]">
                    {selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Order ID & Date</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Customer</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Items & Total</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Delivery Address</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-zora-stone)]">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrderIds.has(order.id!);
                  const addr = order.shippingAddress;
                  const mapsUrl = addr.latitude && addr.longitude 
                    ? `https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.pincode}`)}`;

                  return (
                    <tr key={order.id} className={`border-b border-[var(--color-zora-ink)]/5 hover:bg-[var(--color-zora-oat)]/30 transition-colors ${isSelected ? 'bg-[var(--color-zora-blush)]/20' : ''}`}>
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelection(order.id!)} className="text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]">
                          {isSelected ? <CheckSquare className="h-5 w-5 text-[var(--color-zora-ink)]" /> : <Square className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="p-4 align-top">
                        <p className="font-mono text-xs font-bold text-[var(--color-zora-ink)] mb-1">
                          {order.id?.slice(-8)?.toUpperCase() || 'UNKNOWN'}
                        </p>
                        <p className="text-xs text-[var(--color-zora-stone)]">
                          {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : '...'}
                        </p>
                      </td>
                      <td className="p-4 align-top">
                        <p className="text-sm font-bold text-[var(--color-zora-ink)]">{addr.fullName}</p>
                        <p className="text-xs text-[var(--color-zora-stone)]">{addr.phone}</p>
                      </td>
                      <td className="p-4 align-top">
                        <p className="text-sm font-bold text-[var(--color-zora-ink)]">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-[var(--color-zora-stone)]">{order.items.length} items</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="text-[10px] bg-[var(--color-zora-oat)] px-2 py-1 rounded-md text-[var(--color-zora-ink)] border border-[var(--color-zora-ink)]/10">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <p className="text-xs text-[var(--color-zora-ink)] line-clamp-2 mb-1">
                          {addr.addressLine1}, {addr.addressLine2 ? addr.addressLine2 + ', ' : ''}
                          {addr.city}, {addr.state} {addr.pincode}
                        </p>
                        {addr.landmark && <p className="text-xs text-[var(--color-zora-stone)] mb-2">Landmark: {addr.landmark}</p>}
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          <MapPin className="h-3 w-3" /> Open in Maps <ExternalLink className="h-3 w-3 ml-0.5" />
                        </a>
                      </td>
                      <td className="p-4 align-top">
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id!, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer ${
                            order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                            order.orderStatus === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-[var(--color-zora-blush)]/30 border-[var(--color-zora-ink)]/20 text-[var(--color-zora-ink)]'
                          }`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden flex flex-col divide-y divide-[var(--color-zora-ink)]/10">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-zora-stone)]">
              No orders found matching your filters.
            </div>
          ) : (
            filteredOrders.map(order => {
              const isSelected = selectedOrderIds.has(order.id!);
              const addr = order.shippingAddress;
              const mapsUrl = addr.latitude && addr.longitude 
                ? `https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.pincode}`)}`;

              return (
                <div key={order.id} className={`p-5 flex flex-col gap-4 ${isSelected ? 'bg-[var(--color-zora-blush)]/20' : ''}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleSelection(order.id!)} className="text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] mt-0.5">
                        {isSelected ? <CheckSquare className="h-5 w-5 text-[var(--color-zora-ink)]" /> : <Square className="h-5 w-5" />}
                      </button>
                      <div>
                        <p className="font-mono text-sm font-bold text-[var(--color-zora-ink)] mb-0.5">
                          #{order.id?.slice(-8)?.toUpperCase() || 'UNKNOWN'}
                        </p>
                        <p className="text-xs text-[var(--color-zora-stone)]">
                          {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : '...'}
                        </p>
                      </div>
                    </div>
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id!, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer text-center ${
                        order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-[var(--color-zora-blush)]/30 border-[var(--color-zora-ink)]/20 text-[var(--color-zora-ink)]'
                      }`}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[var(--color-zora-oat)]/30 p-3 rounded-xl border border-[var(--color-zora-ink)]/5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-zora-stone)] mb-1">Customer</p>
                      <p className="text-sm font-bold text-[var(--color-zora-ink)]">{addr.fullName}</p>
                      <p className="text-xs text-[var(--color-zora-stone)] mt-0.5">{addr.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-zora-stone)] mb-1">Total</p>
                      <p className="text-sm font-bold text-[var(--color-zora-ink)]">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-[var(--color-zora-stone)] mt-0.5">{order.items.length} item(s)</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--color-zora-ink)] mb-2">
                      {addr.addressLine1}, {addr.city} {addr.pincode}
                    </p>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      <MapPin className="h-3 w-3" /> Open in Maps <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
