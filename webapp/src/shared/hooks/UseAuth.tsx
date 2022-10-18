import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/auth-context';

interface UseAuthType extends AuthContextType {
  isMe?: boolean;
}

export function useAuth(routeUsername?: string): UseAuthType {
  const authContext = useContext(AuthContext);

  return {
    isMe: routeUsername
      ? authContext.authUser?.username === routeUsername
      : undefined,
    ...authContext,
  };
}
