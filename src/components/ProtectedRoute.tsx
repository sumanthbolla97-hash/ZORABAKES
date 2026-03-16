import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-zora-oat)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-zora-ink)] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
