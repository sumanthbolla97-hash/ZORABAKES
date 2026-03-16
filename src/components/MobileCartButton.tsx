import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function MobileCartButton() {
  const { items } = useCart();
  const { user } = useAuth();
  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Only show the button if the user is logged in
  if (!user) {
    return null;
  }

  return (
    <Link 
      to="/cart" 
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-zora-ink)] text-white shadow-lg md:hidden transition-transform duration-200 hover:scale-105"
      aria-label="View Cart"
    >
      <ShoppingBag className="h-6 w-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-xs font-bold text-[var(--color-zora-ink)] shadow-sm">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
}