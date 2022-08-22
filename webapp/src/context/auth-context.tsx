import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../shared/generated';
import { useData } from '../shared/hooks/UseData';
import { authApi, usersApi } from '../shared/services/ApiService';
import { HOST_URL } from '../shared/urls';

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
  const { data, isLoading: loading } = useData<User>(getCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
    if (data) {
      setUser(data);
    }
  }, [data, loading]);

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
