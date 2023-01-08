import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserWithAuthorizationResponseDto,
  UserToRoleDto,
  UserToRoleDtoRoleEnum,
  ResponseError,
} from '../generated';
import { useData } from '../hooks/UseData';
import { authApi } from '../services/ApiService';
import socket from '../socket';
import { HOST_URL } from '../urls';
import { useNotificationContext } from './NotificationContext';

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
  const { warn } = useNotificationContext();
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
      if (error instanceof ResponseError) {
        const responseBody = await error.response.json();
        if (responseBody.message) {
          warn(responseBody.message);
        } else {
          warn(error.response.statusText);
        }
      } else if (error instanceof Error) {
        warn(error.message);
      } else {
        warn('Could not logout');
      }
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
            case UserToRoleDtoRoleEnum.Moderator: {
              setAuthUser({ ...authUser, gAdmin: isAdd });
              break;
            }
            case UserToRoleDtoRoleEnum.Owner: {
              warn('Someone tried to make you an owner');
              break;
            }
            case UserToRoleDtoRoleEnum.Banned: {
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
  }, [authUser, logout, warn]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
