import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserWithAuthorizationResponseDto } from '../generated';
import { UserToRoleDto, Role } from 'transcendence-shared';
import { useData } from '../hooks/UseData';
import { authApi } from '../services/ApiService';
import socket from '../socket';
import { HOST_URL } from '../urls';
import { useNotificationContext } from './NotificationContext';
import { handleRequestError } from '../utils/HandleRequestError';

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  authUser: UserWithAuthorizationResponseDto | null;
  setAuthUser: React.Dispatch<
    React.SetStateAction<UserWithAuthorizationResponseDto | null>
  >;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { notify, warn } = useNotificationContext();
  const [authUser, setAuthUser] =
    useState<UserWithAuthorizationResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUser = useCallback(() => {
    return authApi.authControllerRetrieveAuthUserWithRoles();
  }, []);
  const { data, isLoading: isDataLoading } =
    useData<UserWithAuthorizationResponseDto>(getCurrentUser);
  const navigate = useNavigate();
  const authBroadcastChannel = useMemo(
    () => new BroadcastChannel('auth_channel'),
    [],
  );
  authBroadcastChannel.onmessage = (event) => {
    if (authUser && event.data && authUser.id === event.data.id) {
      setAuthUser(null);
      navigate(HOST_URL);
    }
  };

  useEffect(() => {
    setIsLoading(isDataLoading);
    setAuthUser(data);
  }, [data, isDataLoading]);

  useEffect(() => {
    if (authUser) {
      socket.connect();
    }
  }, [authUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.authControllerLogout();
      authBroadcastChannel.postMessage(authUser);
    } catch (error: unknown) {
      handleRequestError(error, 'Could not logout', warn);
    } finally {
      setAuthUser(null);
      navigate(HOST_URL);
    }
  }, [navigate, authBroadcastChannel, authUser, warn]);

  const contextValue = useMemo(
    () => ({
      isLoading: isLoading,
      logout: logout,
      isLoggedIn: authUser !== null,
      authUser,
      setAuthUser,
    }),
    [isLoading, authUser, logout],
  );

  useEffect(() => {
    const userToRoleListener =
      (isAdd: boolean) => async (userToRole: UserToRoleDto) => {
        if (authUser && userToRole.id === authUser.id) {
          switch (userToRole.role) {
            case Role.moderator: {
              setAuthUser({ ...authUser, gAdmin: isAdd });
              break;
            }
            case Role.owner: {
              warn('Someone tried to make you an owner');
              break;
            }
            case Role.banned: {
              if (!authUser.gOwner) {
                if (isAdd) {
                  logout();
                }
              } else {
                warn('Someone tried to ban you');
              }
              break;
            }
          }
        } else if (authUser) {
          notify(
            isAdd
              ? `Successfully set ${userToRole.role} role to '${userToRole.username}'`
              : `Successfully unset ${userToRole.role} role from '${userToRole.username}'`,
          );
        }
      };

    if (authUser) {
      socket.on('addedUserToRole', userToRoleListener(true));
      socket.on('deletedUserToRole', userToRoleListener(false));
    }

    return () => {
      socket.off('addedUserToRole');
      socket.off('deletedUserToRole');
    };
  }, [authUser, logout, warn, notify]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
