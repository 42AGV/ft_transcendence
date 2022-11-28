import { useContext } from 'react';
import { OnlineUsersContext } from '../context/OnlineUsersContext';

export function useOnlineUsers() {
  return useContext(OnlineUsersContext);
}
