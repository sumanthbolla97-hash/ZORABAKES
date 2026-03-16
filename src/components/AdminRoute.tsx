import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute() {
  const { user, isAdmin, isAuthReady } = useAuth();

  if (!isAuthReady) {
    // Show a loading spinner or placeholder while authentication status is being determined
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-zora-oat)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-zora-ink)] border-t-transparent"></div>
      </div>
    );
  }

  // If not logged in or not an admin, redirect to home or login page
  if (!user || !isAdmin) {
    // You can choose to redirect to /login or a specific unauthorized page
    // For now, redirecting to home if not admin, or login if not authenticated at all.
    return <Navigate to={user ? "/" : "/login"} replace />;
  }

  return <Outlet />;
}