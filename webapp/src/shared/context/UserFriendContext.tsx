import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import { useData } from '../hooks/UseData';
import { usersApi } from '../services/ApiService';
import socket from '../socket';

type FriendId = string;

export interface UserFriendContextType {
  userFriends: (userId: string) => boolean;
}

export const UserFriendContext = createContext<UserFriendContextType>(null!);

export const UserFriendProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const [friends, setFriends] = useState(new Set<FriendId>());
  const getFriends = useCallback(() => usersApi.userControllerGetFriends(), []);
  const { data: friendsUsers } = useData(getFriends);

  useEffect(() => {
    if (friendsUsers) {
      setFriends(new Set(friendsUsers.map((user) => user.id)));
    }
  }, [friendsUsers]);

  useEffect(() => {
    const followListener = (friendId: FriendId) => {
      setFriends((prev) => new Set([...prev, friendId]));
    };

    const unFollowListener = (friendId: FriendId) => {
      setFriends(
        (prev) => new Set([...prev].filter((userId) => userId !== friendId)),
      );
    };

    if (authUser) {
      socket.on('follow', followListener);
      socket.on('unfollow', unFollowListener);
    }

    return () => {
      socket.off('follow');
      socket.off('unfollow');
    };
  });

  const userFriends = useCallback(
    (userId: string) => {
      if (!friendsUsers) {
        return true;
      }
      return friends.has(userId);
    },
    [friendsUsers, friends],
  );

  const contextValue = {
    userFriends,
  };

  return (
    <UserFriendContext.Provider value={contextValue}>
      {children}
    </UserFriendContext.Provider>
  );
};
