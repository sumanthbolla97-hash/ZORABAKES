import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/Button";

export function Cart() {
  const { items, subtotal, deliveryCharge, tax, total, updateQuantity, removeItem, clearCart, user } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center md:px-12">
        <h1 className="mb-6 font-serif text-5xl font-bold text-[var(--color-zora-ink)]">Your Box is Empty</h1>
        <p className="mb-10 text-lg font-medium text-[var(--color-zora-stone)]">
          Looks like you haven't added any sweet treats yet.
        </p>
        <Link to="/shop">
          <Button size="lg">Explore Bakery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 md:px-12 md:py-24">
      <h1 className="mb-12 font-serif text-5xl font-bold text-[var(--color-zora-ink)] md:text-6xl">Your Box</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-[var(--color-zora-ink)]/10 pb-8">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-zora-oat)]">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--color-zora-ink)] mb-1">{item.name}</h3>
                    <p className="text-sm font-bold text-[var(--color-zora-stone)]">${item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border-2 border-[var(--color-zora-ink)]/20 rounded-full overflow-hidden bg-white h-10">
                    <button 
                      className="flex h-10 w-10 items-center justify-center text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-blush)] transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex h-10 w-10 items-center justify-center text-sm font-bold text-[var(--color-zora-ink)]">
                      {item.quantity}
                    </span>
                    <button 
                      className="flex h-10 w-10 items-center justify-center text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-blush)] transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-bold text-[var(--color-zora-ink)] text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Link to="/shop" className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors">
              Continue Shopping
            </Link>
            <button 
              onClick={clearCart}
              className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors"
            >
              Clear Box
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5 sticky top-32">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-zora-ink)] mb-8">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-sm font-medium text-[var(--color-zora-stone)] mb-8 border-b border-[var(--color-zora-ink)]/10 pb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-[var(--color-zora-ink)] font-bold">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]">Total</span>
              <span className="font-serif text-3xl font-bold text-[var(--color-zora-ink)]">${total.toFixed(2)}</span>
            </div>
            
            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                if (!user) {
                  alert("Please log in to checkout.");
                  navigate("/login");
                } else {
                  navigate("/checkout");
                }
              }}
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Button>

            {!user && (
              <p className="mt-6 text-center text-xs font-medium text-[var(--color-zora-stone)]">
                Log in to save your cart across devices.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
