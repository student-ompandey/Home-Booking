import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, ownerOnly = false, adminOnly = false }) {
  const { isAuthenticated, isOwner, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
}
