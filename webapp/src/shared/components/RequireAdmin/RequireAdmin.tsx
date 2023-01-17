import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { HOST_URL } from '../../urls';
import Loading from '../Loading/Loading';
import './RequireAdmin.css';

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { authUser, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="require-admin">
        <Loading />
      </div>
    );
  }

  if (!isLoggedIn || (authUser && !authUser.gAdmin && !authUser.gOwner)) {
    return <Navigate to={HOST_URL} />;
  }

  return children;
}
