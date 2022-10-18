import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../generated';
import { useData } from '../hooks/UseData';
import { authApi, usersApi } from '../services/ApiService';
import { HOST_URL } from '../urls';

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUser = useCallback(() => {
    return usersApi.userControllerGetCurrentUser();
  }, []);
  const { data, isLoading: isDataLoading } = useData<User>(getCurrentUser);
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

  const logout = useCallback(async () => {
    try {
      await authApi.authControllerLogout();
      authBroadcastChannel.postMessage(authUser);
    } catch (err) {
      console.error(err);
    } finally {
      setAuthUser(null);
      navigate(HOST_URL);
    }
  }, [navigate, authBroadcastChannel, authUser]);

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

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
