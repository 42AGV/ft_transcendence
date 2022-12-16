import { useContext } from 'react';
import { UserFriendContext } from '../context/UserFriendContext';

export function useFriend() {
  return useContext(UserFriendContext);
}
