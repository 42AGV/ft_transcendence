import { useContext } from 'react';
import { UserStatusContext } from '../context/UserStatusContext';

export function useUserStatus() {
  return useContext(UserStatusContext);
}
