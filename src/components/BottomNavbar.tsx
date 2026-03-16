import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, User, Package, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function BottomNavbar() {
  const { user } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Define navigation items
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/shop', icon: Search, label: 'Shop' }, // Using Search icon for Shop as per prompt's "Search" item
    { path: '/profile?tab=orders', icon: Package, label: 'Orders', authRequired: true },
    { path: '/cart', icon: ShoppingBag, label: 'Cart', authRequired: true, showCount: true },
    { path: '/profile', icon: User, label: 'Profile', authRequired: true },
  ];

  // Filter items based on authentication status
  const filteredNavItems = navItems.filter(item => !item.authRequired || user);

  // Highlight active link
  const isActive = (path: string) => {
    // Special handling for profile tabs
    if (path.includes('/profile?tab=')) {
      return location.pathname === '/profile' && location.search === `?tab=${path.split('=')[1]}`;
    }
    // For /profile, consider it active if any profile tab is active
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    // For /shop, consider it active if on /shop or /product/:id
    if (path === '/shop') {
      return location.pathname.startsWith('/shop') || location.pathname.startsWith('/product/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg md:hidden border-t border-[var(--color-zora-ink)]/10">
      <div className="flex h-16 items-center justify-around">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors ${
                active ? 'text-[var(--color-zora-ink)]' : 'text-[var(--color-zora-stone)] hover:text-[var(--color-zora-ink)]'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {item.showCount && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-zora-blush)] text-[10px] font-bold text-[var(--color-zora-ink)] shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}