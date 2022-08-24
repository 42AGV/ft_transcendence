import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

export function useAuth() {
  return useContext(AuthContext);
}
