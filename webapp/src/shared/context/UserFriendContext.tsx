import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';

type FriendId = string;

export interface UserFriendContextType {
  userFriends: (userId: string) => boolean;
}

export const UserFriendContext = createContext<UserFriendContextType>(null!);

export const UserFriendProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const [friends, setFriends] = useState(new Set<FriendId>());

  useEffect(() => {
    const friendsListener = (friendIds: FriendId[]) => {
      setFriends(new Set(friendIds));
    };

    const followListener = (friendId: FriendId) => {
      setFriends((prev) => new Set([...prev, friendId]));
    };

    const unFollowListener = (friendId: FriendId) => {
      setFriends(
        (prev) => new Set([...prev].filter((userId) => userId !== friendId)),
      );
    };

    if (authUser) {
      socket.on('friends', friendsListener);
      socket.on('follow', followListener);
      socket.on('unfollow', unFollowListener);
      socket.emit('getFriends');
    }

    return () => {
      socket.off('friends');
      socket.off('follow');
      socket.off('unfollow');
    };
  }, [authUser]);

  const userFriends = useCallback(
    (userId: string) => {
      return friends.has(userId);
    },
    [friends],
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
