import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../shared/generated';
import { authApi, usersApi } from '../shared/services/ApiService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: (callback: VoidFunction) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi
      .userControllerGetCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // TODO: Improve function prototype
  const logout = async (callback: VoidFunction) => {
    try {
      await authApi.authControllerLogout();
    } catch {
    } finally {
      setUser(null);
      callback();
    }
  };

  const value = { loading, user, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
