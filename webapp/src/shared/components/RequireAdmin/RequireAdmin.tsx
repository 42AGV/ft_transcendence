import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { HOST_URL } from '../../urls';
import Loading from '../Loading/Loading';

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { authUser, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn || (authUser && !authUser.gAdmin && !authUser.gOwner)) {
    return <Navigate to={HOST_URL} />;
  }

  return children;
}
