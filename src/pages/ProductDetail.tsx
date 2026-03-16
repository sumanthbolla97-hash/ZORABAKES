import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: "signature-vanilla-cupcake",
      name: "Signature Vanilla Cupcake",
      price: 4.50,
      quantity: quantity,
      img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop"
    });
    // Optional: Add a toast notification here
  };

  return (
    <div className="container mx-auto px-6 py-12 md:px-12 md:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        {/* Product Images */}
        <div className="flex flex-col gap-6">
          <div className="aspect-square w-full overflow-hidden rounded-3xl bg-[var(--color-zora-oat)] shadow-sm border border-[var(--color-zora-ink)]/5">
            <img 
              src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop" 
              alt="Signature Vanilla Cupcake" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-zora-oat)] cursor-pointer border border-[var(--color-zora-ink)]/5">
                <img 
                  src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop" 
                  alt={`Thumbnail ${i}`} 
                  className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--color-zora-stone)]">
            <span>Cupcakes</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-zora-clay)]" />
            <span>Bestseller</span>
          </div>
          
          <h1 className="mb-4 font-serif text-5xl font-bold text-[var(--color-zora-ink)] md:text-6xl">Signature Vanilla Cupcake</h1>
          
          <div className="mb-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-[var(--color-zora-ink)]">$4.50</span>
            <div className="flex items-center gap-1 text-[var(--color-zora-stone)]">
              <div className="flex text-[var(--color-zora-clay)]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium ml-2">(128 Reviews)</span>
            </div>
          </div>

          <p className="mb-10 text-lg font-medium leading-relaxed text-[var(--color-zora-stone)]">
            Our world-famous classic vanilla cupcake, topped with our signature pastel buttercream swirl. Baked fresh daily with real vanilla bean and a touch of wholesome millet flour for a tender, perfect crumb.
          </p>

          <div className="mb-10 flex flex-col gap-6 border-y-2 border-[var(--color-zora-ink)]/10 py-8">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Quantity</span>
              <div className="flex items-center border-2 border-[var(--color-zora-ink)]/20 rounded-full overflow-hidden bg-white">
                <button 
                  className="flex h-12 w-12 items-center justify-center text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-blush)] transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-12 items-center justify-center text-base font-bold text-[var(--color-zora-ink)]">{quantity}</span>
                <button 
                  className="flex h-12 w-12 items-center justify-center text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-blush)] transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <Button size="lg" className="w-full text-lg shadow-md" onClick={handleAddToCart}>
              Add to Box - ${(4.5 * quantity).toFixed(2)}
            </Button>
          </div>

          <div className="space-y-6">
            <div className="border-b border-[var(--color-zora-ink)]/10 pb-4">
              <h3 className="mb-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Ingredients</h3>
              <p className="text-sm font-medium leading-relaxed text-[var(--color-zora-stone)]">
                Unbleached Flour, Millet Flour, Sweet Cream Butter, Sugar, Free-Range Eggs, Whole Milk, Pure Vanilla Extract, Baking Powder, Sea Salt.
              </p>
            </div>
            <div className="border-b border-[var(--color-zora-ink)]/10 pb-4">
              <h3 className="mb-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">Allergens</h3>
              <p className="text-sm font-medium leading-relaxed text-[var(--color-zora-stone)]">
                Contains Wheat, Milk, and Eggs. Baked in a facility that also processes tree nuts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
