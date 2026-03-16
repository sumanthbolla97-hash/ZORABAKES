import { Link } from "react-router";
import { ShoppingBag, Menu, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-zora-clay)] bg-[var(--color-zora-oat)]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-6 md:hidden">
          <button className="text-[var(--color-zora-ink)]">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
          <Link to="/shop" className="hover:text-[var(--color-zora-stone)] transition-colors">Bakery</Link>
          <Link to="/about" className="hover:text-[var(--color-zora-stone)] transition-colors">Our Story</Link>
        </nav>

        <div className="flex-1 text-center md:flex-none">
          <Link to="/" className="font-serif text-4xl font-bold tracking-tight text-[var(--color-zora-ink)]">
            ZORA BAKES
          </Link>
        </div>

        <div className="flex items-center justify-end gap-6 md:gap-8">
          <button className="text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors hidden md:block">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/contact" className="hidden md:block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors">
            Contact
          </Link>
          <button className="text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-[9px] font-bold text-[var(--color-zora-ink)] border border-[var(--color-zora-ink)]">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
