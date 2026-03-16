import { Link } from "react-router";
import { Filter, ChevronDown } from "lucide-react";

export function Shop() {
  return (
    <div className="container mx-auto px-6 py-12 md:px-12 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 font-serif text-5xl font-bold text-[var(--color-zora-ink)] md:text-6xl">Bakery Menu</h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--color-zora-stone)]">
          Freshly baked daily using classic recipes and wholesome millet grains.
        </p>
      </div>

      <div className="mb-12 flex flex-col justify-between gap-6 border-b-2 border-[var(--color-zora-ink)]/10 pb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <div className="hidden h-4 w-px bg-[var(--color-zora-ink)]/20 md:block" />
          <span className="text-sm font-medium text-[var(--color-zora-stone)]">12 Treats</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-zora-stone)]">Sort by:</span>
          <button className="flex items-center gap-1 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors">
            Featured <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "Signature Vanilla Cupcake", price: "$4.50", img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop" },
          { name: "Chocolate Ragi Cake Slice", price: "$7.00", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop" },
          { name: "Classic Chocolate Chunk Cookie", price: "$3.50", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop" },
          { name: "Strawberry Buttercream Cake", price: "$45.00", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop" },
          { name: "Lemon Blueberry Muffin", price: "$4.00", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop" },
          { name: "Pistachio Rose Cupcake", price: "$5.00", img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop" }
        ].map((product, i) => (
          <Link to="/product/1" key={i} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[var(--color-zora-ink)]/5">
            <div className="relative aspect-square overflow-hidden bg-[var(--color-zora-alabaster)]">
              <img 
                src={product.img} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full translate-y-full bg-[var(--color-zora-blush)]/90 backdrop-blur-sm py-4 text-center text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] transition-transform duration-300 group-hover:translate-y-0">
                Quick Add
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="mb-2 font-serif text-2xl font-bold text-[var(--color-zora-ink)]">{product.name}</h3>
              <p className="text-sm font-bold text-[var(--color-zora-stone)]">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
