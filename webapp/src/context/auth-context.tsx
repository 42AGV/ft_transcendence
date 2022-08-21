import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../shared/generated';
import { authApi, usersApi } from '../shared/services/ApiService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: (callback: VoidFunction) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    usersApi
      .userControllerGetCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = async (callback: VoidFunction) => {
    try {
      await authApi.authControllerLogout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      callback();
    }
  };

  const value = { isLoading, user, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
