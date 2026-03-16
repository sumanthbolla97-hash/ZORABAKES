import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { logout } from '../firebase';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  // Calculate total items in cart
  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Highlight active link
  const isActive = (path: string) => 
    (location.pathname.startsWith(path) && path !== '/') || location.pathname === path;

  const navLinkClass = (path: string) => 
    `text-sm font-bold tracking-widest uppercase transition-colors ${isActive(path) ? 'text-[var(--color-zora-ink)]' : 'text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]'}`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--color-zora-ink)]/10">
      <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-bold text-[var(--color-zora-ink)]" onClick={closeMenu}>
          ZORA BAKES.
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop" className={navLinkClass('/shop')}>Shop</Link>
          <Link to="/about" className={navLinkClass('/about')}>About</Link>
          <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
        </div>

        {/* Desktop Actions (Auth & Cart) */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              {isAdmin && (
                <Link to="/admin/orders" className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-blue-600 hover:text-blue-800 transition-colors" title="Admin Dashboard">
                  <Shield className="h-5 w-5" /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors">
                <User className="h-5 w-5" /> Profile
              </Link>
              <button onClick={logout} className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] hover:text-red-500 transition-colors" title="Log Out">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold tracking-widest uppercase text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)] transition-colors">
              Log In
            </Link>
          )}
          
          <div className="h-6 w-px bg-[var(--color-zora-ink)]/10"></div>

          <Link to="/cart" className="relative text-[var(--color-zora-ink)] hover:text-[var(--color-zora-stone)] transition-colors">
            <ShoppingBag className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-[10px] font-bold text-[var(--color-zora-ink)] shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Actions Toggle */}
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-[var(--color-zora-ink)] focus:outline-none flex items-center">
            {isOpen ? (
              <X className="h-7 w-7" />
            ) : user ? (
              <User className="h-7 w-7" />
            ) : (
              <span className="text-sm font-bold tracking-widest uppercase">Log In</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-[var(--color-zora-ink)]/10 shadow-xl flex flex-col px-6 py-8 gap-6 animate-in slide-in-from-top-2">
          <Link to="/shop" className="text-xl font-bold tracking-widest uppercase text-[var(--color-zora-ink)]" onClick={closeMenu}>Shop</Link>
          <Link to="/about" className="text-xl font-bold tracking-widest uppercase text-[var(--color-zora-ink)]" onClick={closeMenu}>About</Link>
          <Link to="/contact" className="text-xl font-bold tracking-widest uppercase text-[var(--color-zora-ink)]" onClick={closeMenu}>Contact</Link>
          <Link to="/cart" className="flex items-center justify-between text-xl font-bold tracking-widest uppercase text-[var(--color-zora-ink)]" onClick={closeMenu}>
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6" />
              <span>Cart</span>
            </div>
            {cartItemCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-xs font-bold text-[var(--color-zora-ink)] shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <div className="h-px w-full bg-[var(--color-zora-ink)]/10 my-2" />
          
          {user ? (
            <div className="flex flex-col gap-6">
              <Link to="/profile" className="flex items-center gap-3 text-lg font-bold tracking-widest uppercase text-[var(--color-zora-ink)]" onClick={closeMenu}>
                <User className="h-6 w-6" /> My Profile
              </Link>
              {isAdmin && (
                <Link to="/admin/orders" className="flex items-center gap-3 text-lg font-bold tracking-widest uppercase text-blue-600" onClick={closeMenu}>
                  <Shield className="h-6 w-6" /> Admin Dashboard
                </Link>
              )}
              <button onClick={() => { logout(); closeMenu(); }} className="flex items-center gap-3 text-lg font-bold tracking-widest uppercase text-red-500 text-left">
                <LogOut className="h-6 w-6" /> Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" className="flex items-center justify-center w-full bg-[var(--color-zora-oat)] py-4 rounded-xl font-bold tracking-widest uppercase text-[var(--color-zora-ink)] border border-[var(--color-zora-ink)]/10" onClick={closeMenu}>
                Log In
              </Link>
              <Link to="/signup" className="flex items-center justify-center w-full bg-[var(--color-zora-ink)] py-4 rounded-xl font-bold tracking-widest uppercase text-[var(--color-zora-oat)]" onClick={closeMenu}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}