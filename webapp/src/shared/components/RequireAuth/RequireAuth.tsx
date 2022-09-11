import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { HOST_URL } from '../../urls';
import Loading from '../Loading/Loading';
import './RequireAuth.css';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="require-auth">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={HOST_URL} />;
  }

  return children;
}
