import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { productService, Product } from "../services/productService";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Package, Tag, Save, X } from "lucide-react";

export function AdminProducts() {
  const { isAdmin, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    images: "",
    ingredients: "",
    stock: "",
    SKU: "",
    category: ""
  });

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

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        offerPrice: product.offerPrice ? product.offerPrice.toString() : "",
        images: product.images.join(", "),
        ingredients: product.ingredients.join(", "),
        stock: product.stock.toString(),
        SKU: product.SKU,
        category: product.category
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        images: "",
        ingredients: "",
        stock: "",
        SKU: "",
        category: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : undefined,
        images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
        ingredients: formData.ingredients.split(",").map(s => s.trim()).filter(Boolean),
        stock: parseInt(formData.stock, 10),
        SKU: formData.SKU,
        category: formData.category
      };

      if (editingProduct && editingProduct.id) {
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      await productService.updateStock(id, newStock);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };

  const filteredProducts = products.filter(product => 
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.SKU || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  if (loading) {
    return <div className="text-center py-24 text-[var(--color-zora-stone)]">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-zora-ink)]">Product Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-zora-stone)]" />
            <input 
              type="text" 
              placeholder="Search Name, SKU, Category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-zora-ink)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
            />
          </div>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--color-zora-ink)]/10 bg-[var(--color-zora-oat)]/50">
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Product</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Category & SKU</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Price</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">Stock</th>
                <th className="p-4 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-zora-stone)]">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-[var(--color-zora-ink)]/5 hover:bg-[var(--color-zora-oat)]/30 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      {product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-[var(--color-zora-ink)]/10" />
                      ) : (
                        <div className="w-12 h-12 bg-[var(--color-zora-oat)] rounded-lg flex items-center justify-center border border-[var(--color-zora-ink)]/10">
                          <ImageIcon className="h-5 w-5 text-[var(--color-zora-stone)]/50" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[var(--color-zora-ink)]">{product.name}</p>
                        <p className="text-xs text-[var(--color-zora-stone)] line-clamp-1 max-w-xs">{product.description}</p>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-[var(--color-zora-oat)] px-2 py-1 rounded-md text-[var(--color-zora-ink)] mb-1">
                        <Tag className="h-3 w-3" /> {product.category}
                      </span>
                      <p className="text-xs font-mono text-[var(--color-zora-stone)]">{product.SKU}</p>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="font-bold text-[var(--color-zora-ink)]">${product.price.toFixed(2)}</p>
                      {product.offerPrice && (
                        <p className="text-xs text-[var(--color-zora-blush)] font-medium line-through">${product.offerPrice.toFixed(2)}</p>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Package className={`h-4 w-4 ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                        <input 
                          type="number" 
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id!, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-sm rounded border border-[var(--color-zora-ink)]/20 focus:outline-none focus:border-[var(--color-zora-ink)]"
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-oat)] rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id!)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden flex flex-col divide-y divide-[var(--color-zora-ink)]/10">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-zora-stone)]">
              No products found.
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="p-5 flex flex-col gap-4 hover:bg-[var(--color-zora-oat)]/30 transition-colors">
                <div className="flex gap-4 items-start">
                  {product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-[var(--color-zora-ink)]/10 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-[var(--color-zora-oat)] rounded-xl flex items-center justify-center border border-[var(--color-zora-ink)]/10 shrink-0">
                      <ImageIcon className="h-6 w-6 text-[var(--color-zora-stone)]/50" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--color-zora-ink)] text-base truncate">{product.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 mb-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[var(--color-zora-oat)] px-2 py-0.5 rounded-md text-[var(--color-zora-ink)]">
                        <Tag className="h-3 w-3" /> {product.category}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-zora-stone)]">{product.SKU}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-bold text-[var(--color-zora-ink)]">${product.price.toFixed(2)}</p>
                      {product.offerPrice && (
                        <p className="text-xs text-[var(--color-zora-blush)] font-medium line-through">${product.offerPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-zora-ink)]/5">
                  <div className="flex items-center gap-2">
                    <Package className={`h-4 w-4 ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="text-sm font-bold text-[var(--color-zora-stone)]">Stock:</span>
                    <input 
                      type="number" 
                      value={product.stock}
                      onChange={(e) => handleStockUpdate(product.id!, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm rounded border border-[var(--color-zora-ink)]/20 focus:outline-none focus:border-[var(--color-zora-ink)] bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="p-2 bg-white border border-[var(--color-zora-ink)]/10 text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id!)}
                      className="p-2 bg-white border border-red-100 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-[var(--color-zora-ink)]/10 p-6 flex justify-between items-center z-10">
              <h2 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] rounded-full hover:bg-[var(--color-zora-oat)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)] resize-none" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Price ($)</label>
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Offer Price ($) <span className="text-xs font-normal normal-case text-[var(--color-zora-stone)]">(Optional)</span></label>
                  <input type="number" step="0.01" min="0" value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">SKU</label>
                  <input required type="text" value={formData.SKU} onChange={e => setFormData({...formData, SKU: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Initial Stock</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Image URLs <span className="text-xs font-normal normal-case text-[var(--color-zora-stone)]">(Comma separated)</span></label>
                  <input required type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..., https://..." className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Ingredients <span className="text-xs font-normal normal-case text-[var(--color-zora-stone)]">(Comma separated)</span></label>
                  <input required type="text" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="Flour, Sugar, Butter..." className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-[var(--color-zora-ink)]/10 mt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
