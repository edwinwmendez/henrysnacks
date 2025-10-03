import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { state } = useAuth();

  // Si requiere autenticación y no está autenticado
  if (requireAdmin && !state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si requiere admin y el usuario no es admin
  if (requireAdmin && state.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
