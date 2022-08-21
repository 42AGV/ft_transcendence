import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    // TODO: Improve style or create Loading component
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
