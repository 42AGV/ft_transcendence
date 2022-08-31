import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { HOST_URL } from '../../urls';
import Loading from '../Loading/Loading';
import './RequireAuth.css';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <div className="require-auth">
        <Loading />
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to={HOST_URL} state={{ from: location }} replace />;
  }

  return children;
}
