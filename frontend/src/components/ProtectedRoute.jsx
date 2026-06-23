import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

export function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/" replace />;
  const homePage = user.role === "admin" ? "/dashboard" : "/transactions";
  if (user.role !== role) return <Navigate to={homePage} replace />;

  return children;
}
