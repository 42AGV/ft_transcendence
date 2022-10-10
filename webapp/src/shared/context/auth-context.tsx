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

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUser = useCallback(async () => {
    return await usersApi.userControllerGetCurrentUser();
  }, []);
  const { data, isLoading: isDataLoading } = useData<User>(getCurrentUser);
  const navigate = useNavigate();
  const authBroadcastChannel = useMemo(
    () => new BroadcastChannel('auth_channel'),
    [],
  );
  authBroadcastChannel.onmessage = (event) => {
    if (user && event.data && user.id === event.data.id) {
      setUser(null);
      navigate(HOST_URL);
    }
  };

  useEffect(() => {
    setIsLoading(isDataLoading);
    setUser(data);
  }, [data, isDataLoading]);

  const logout = useCallback(async () => {
    try {
      await authApi.authControllerLogout();
      authBroadcastChannel.postMessage(user);
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      navigate(HOST_URL);
    }
  }, [navigate, authBroadcastChannel, user]);

  const contextValue = useMemo(
    () => ({
      isLoading: isLoading,
      logout: logout,
      isLoggedIn: user !== null,
      user: user,
    }),
    [isLoading, user, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
