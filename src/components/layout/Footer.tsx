import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-[var(--color-zora-clay)] text-[var(--color-zora-ink)] py-16 md:py-24 border-t border-[var(--color-zora-ink)]/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-serif text-3xl font-bold tracking-tight text-[var(--color-zora-ink)] mb-6 block">
              ZORA BAKES
            </Link>
            <p className="text-sm font-medium text-[var(--color-zora-ink)]/80 max-w-xs leading-relaxed">
              Classic indulgence, baked fresh daily. Elevating the art of baking with wholesome millets and a touch of nostalgia.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] mb-6">Treats</h4>
            <ul className="space-y-4 text-sm font-medium text-[var(--color-zora-ink)]/80">
              <li><Link to="/shop" className="hover:text-[var(--color-zora-ink)] transition-colors">All Baked Goods</Link></li>
              <li><Link to="/shop?category=cupcakes" className="hover:text-[var(--color-zora-ink)] transition-colors">Signature Cupcakes</Link></li>
              <li><Link to="/shop?category=cookies" className="hover:text-[var(--color-zora-ink)] transition-colors">Classic Cookies</Link></li>
              <li><Link to="/shop?category=cakes" className="hover:text-[var(--color-zora-ink)] transition-colors">Celebration Cakes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] mb-6">About Us</h4>
            <ul className="space-y-4 text-sm font-medium text-[var(--color-zora-ink)]/80">
              <li><Link to="/about" className="hover:text-[var(--color-zora-ink)] transition-colors">Our Story</Link></li>
              <li><Link to="/about#ingredients" className="hover:text-[var(--color-zora-ink)] transition-colors">Our Ingredients</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-zora-ink)] transition-colors">Locations</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-zora-ink)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-zora-ink)] mb-6">Sweet Updates</h4>
            <p className="text-sm font-medium text-[var(--color-zora-ink)]/80 mb-4">
              Subscribe for fresh-baked news and sweet offers.
            </p>
            <form className="flex border-b-2 border-[var(--color-zora-ink)]/30 pb-2 focus-within:border-[var(--color-zora-ink)] transition-colors">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-[var(--color-zora-ink)]/50 text-[var(--color-zora-ink)]"
              />
              <button type="submit" className="text-xs font-bold tracking-widest uppercase hover:text-[var(--color-zora-ink)]/70 text-[var(--color-zora-ink)] transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[var(--color-zora-ink)]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-[var(--color-zora-ink)]/70">
            &copy; {new Date().getFullYear()} Zora Bakes. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-medium text-[var(--color-zora-ink)]/70">
            <Link to="#" className="hover:text-[var(--color-zora-ink)] transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-[var(--color-zora-ink)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
