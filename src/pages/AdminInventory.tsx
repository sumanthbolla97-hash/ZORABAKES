import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { productService, Product } from "../services/productService";
import { inventoryService, InventoryLog } from "../services/inventoryService";
import { Button } from "@/components/ui/Button";
import { Search, Package, AlertTriangle, History, X, Save, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function AdminInventory() {
  const { user, userProfile, isAdmin, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Adjust Form
  const [adjustType, setAdjustType] = useState<'restock' | 'adjustment'>('restock');
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // History
  const [historyLogs, setHistoryLogs] = useState<InventoryLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isAuthReady && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isAuthReady, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribe = productService.subscribeToProducts((fetchedProducts) => {
      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleOpenAdjust = (product: Product) => {
    setSelectedProduct(product);
    setAdjustType('restock');
    setAdjustAmount("");
    setAdjustReason("");
    setIsAdjustModalOpen(true);
  };

  const handleOpenHistory = async (product: Product) => {
    setSelectedProduct(product);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const logs = await inventoryService.getInventoryHistory(product.id!);
      setHistoryLogs(logs);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !user) return;
    
    setIsSaving(true);
    try {
      const amount = parseInt(adjustAmount, 10);
      if (isNaN(amount)) throw new Error("Invalid amount");

      let newStock = selectedProduct.stock;
      if (adjustType === 'restock') {
        newStock += amount;
      } else {
        newStock = amount; // Exact adjustment
      }

      if (newStock < 0) throw new Error("Stock cannot be negative");

      const userEmail = userProfile?.email || user.email || 'Unknown';

      await inventoryService.updateStockWithLog(
        selectedProduct.id!,
        selectedProduct.name,
        selectedProduct.stock,
        newStock,
        user.uid,
        userEmail,
        adjustType,
        adjustReason
      );

      setIsAdjustModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to update stock");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.SKU.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= 10);

  if (!isAdmin) return null;

  if (loading) {
    return <div className="text-center py-24 text-[var(--color-zora-stone)]">Loading inventory...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-zora-ink)]">Inventory Management</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-zora-stone)]" />
          <input 
            type="text" 
            placeholder="Search Name, SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-zora-ink)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
          />
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-8 flex items-start gap-4 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800">Low Stock Alert</h3>
            <p className="text-sm text-red-600 mt-1">
              You have {lowStockProducts.length} product(s) with 10 or fewer items in stock.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lowStockProducts.map(p => (
                <span key={p.id} className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-md text-red-700 border border-red-200">
                  {p.name} ({p.stock} left)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--color-zora-ink)]/10 bg-[var(--color-zora-oat)]/50">
              <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Product & SKU</th>
              <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Current Stock</th>
              <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Status</th>
              <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--color-zora-stone)]">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-[var(--color-zora-ink)]/5 hover:bg-[var(--color-zora-oat)]/30 transition-colors">
                  <td className="p-4 align-middle">
                    <p className="font-bold text-[var(--color-zora-ink)]">{product.name}</p>
                    <p className="text-xs font-mono text-[var(--color-zora-stone)]">{product.SKU}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Package className={`h-4 w-4 ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                      <span className="font-bold text-lg text-[var(--color-zora-ink)]">{product.stock}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {product.stock === 0 ? (
                      <span className="inline-flex items-center text-xs font-medium bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">Out of Stock</span>
                    ) : product.stock <= 10 ? (
                      <span className="inline-flex items-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">Low Stock</span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">In Stock</span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        onClick={() => handleOpenAdjust(product)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                      >
                        Adjust Stock
                      </Button>
                      <Button 
                        onClick={() => handleOpenHistory(product)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                      >
                        <History className="h-3 w-3 mr-1" /> History
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <div className="border-b border-[var(--color-zora-ink)]/10 p-6 flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">Adjust Stock</h2>
              <button onClick={() => setIsAdjustModalOpen(false)} className="p-2 text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] rounded-full hover:bg-[var(--color-zora-oat)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdjustment} className="p-6 flex flex-col gap-6">
              <div>
                <p className="text-sm text-[var(--color-zora-stone)] mb-1">Product</p>
                <p className="font-bold text-[var(--color-zora-ink)]">{selectedProduct.name}</p>
                <p className="text-xs font-mono text-[var(--color-zora-stone)]">Current Stock: {selectedProduct.stock}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Adjustment Type</label>
                <select 
                  value={adjustType} 
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)] bg-white"
                >
                  <option value="restock">Add Stock (Restock)</option>
                  <option value="adjustment">Set Exact Stock (Manual Adjustment)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
                  {adjustType === 'restock' ? 'Amount to Add' : 'New Total Stock'}
                </label>
                <input 
                  required 
                  type="number" 
                  min={adjustType === 'restock' ? "1" : "0"} 
                  value={adjustAmount} 
                  onChange={e => setAdjustAmount(e.target.value)} 
                  className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" 
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Reason <span className="text-xs font-normal normal-case text-[var(--color-zora-stone)]">(Optional)</span></label>
                <input 
                  type="text" 
                  value={adjustReason} 
                  onChange={e => setAdjustReason(e.target.value)} 
                  placeholder="e.g. New shipment arrived, Inventory count..."
                  className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" 
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAdjustModalOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Confirm Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="border-b border-[var(--color-zora-ink)]/10 p-6 flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">Inventory History</h2>
                <p className="text-sm text-[var(--color-zora-stone)] mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] rounded-full hover:bg-[var(--color-zora-oat)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {loadingHistory ? (
                <div className="text-center py-12 text-[var(--color-zora-stone)]">Loading history...</div>
              ) : historyLogs.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-zora-stone)]">No history logs found for this product.</div>
              ) : (
                <div className="space-y-4">
                  {historyLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-zora-ink)]/10 bg-[var(--color-zora-oat)]/30">
                      <div className={`mt-1 p-2 rounded-full ${
                        log.quantityChanged > 0 ? 'bg-green-100 text-green-600' : 
                        log.quantityChanged < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {log.quantityChanged > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-[var(--color-zora-ink)] capitalize">{log.changeType}</p>
                          <p className="text-xs text-[var(--color-zora-stone)]">
                            {log.createdAt?.toDate ? new Date(log.createdAt.toDate()).toLocaleString() : 'Just now'}
                          </p>
                        </div>
                        <p className="text-sm text-[var(--color-zora-ink)] mb-2">
                          Stock changed from <span className="font-mono font-bold">{log.previousStock}</span> to <span className="font-mono font-bold">{log.newStock}</span> 
                          <span className="text-[var(--color-zora-stone)] ml-2">({log.quantityChanged > 0 ? '+' : ''}{log.quantityChanged})</span>
                        </p>
                        <div className="flex justify-between items-end">
                          <p className="text-xs text-[var(--color-zora-stone)]">By: {log.userEmail}</p>
                          {log.reason && (
                            <p className="text-xs bg-white px-2 py-1 rounded border border-[var(--color-zora-ink)]/10 text-[var(--color-zora-ink)]">
                              "{log.reason}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
