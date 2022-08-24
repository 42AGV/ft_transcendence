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
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getCurrentUser = useCallback(() => {
    return usersApi.userControllerGetCurrentUser();
  }, []);
  const { data, isLoading: isDataLoading } = useData<User>(getCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(isDataLoading);
    setUser(data);
  }, [data, isDataLoading]);

  const logout = useCallback(async () => {
    try {
      await authApi.authControllerLogout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      navigate(HOST_URL);
    }
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      isLoading,
      user,
      logout,
    }),
    [isLoading, user, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
