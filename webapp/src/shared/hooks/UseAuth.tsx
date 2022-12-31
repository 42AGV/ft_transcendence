import * as React from 'react';

import { AuthContext, AuthContextType } from '../context/auth-context';

interface UseAuthType extends AuthContextType {
  isMe: (routeUserName: string) => boolean | undefined;
}

export function useAuth(): UseAuthType {
  const authContext = React.useContext(AuthContext);

  const isMe = React.useCallback(
    (routeUsername: string) =>
      routeUsername
        ? authContext.authUser?.username === routeUsername
        : undefined,
    [authContext.authUser?.username],
  );

  return {
    isMe,
    ...authContext,
  };
}
