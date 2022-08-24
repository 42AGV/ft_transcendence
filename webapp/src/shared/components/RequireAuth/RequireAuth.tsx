import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { Text, TextVariant, TextWeight } from '../';
import './RequireAuth.css';
import { HOST_URL } from '../../urls';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    // TODO: Replace with Loading component
    return (
      <div className="require-auth">
        <Text variant={TextVariant.SUBHEADING} weight={TextWeight.MEDIUM}>
          Loading...
        </Text>
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to={HOST_URL} state={{ from: location }} replace />;
  }

  return children;
}
