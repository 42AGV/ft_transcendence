import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';

type UserId = string;

export type UserStatus = 'online' | 'offline' | 'playing';

export interface UserStatusContextType {
  userStatus: (userId: UserId | undefined) => UserStatus;
}

export const UserStatusContext = createContext<UserStatusContextType>(null!);

export const UserStatusProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState(new Set<UserId>());

  useEffect(() => {
    const onlineUsersListener = (userIds: UserId[]) => {
      setOnlineUserIds(new Set(userIds));
    };
    const userConnectListener = (userId: UserId) => {
      setOnlineUserIds((prevUserIds) => new Set([...prevUserIds, userId]));
    };
    const userDisconnectListener = (userId: UserId) => {
      setOnlineUserIds(
        (prevUserIds) =>
          new Set([...prevUserIds].filter((id) => id !== userId)),
      );
    };

    if (authUser) {
      socket.on('onlineUsers', onlineUsersListener);
      socket.on('userConnect', userConnectListener);
      socket.on('userDisconnect', userDisconnectListener);
      socket.emit('getOnlineUsers');
    }

    return () => {
      socket.off('onlineUsers');
      socket.off('userConnect');
      socket.off('userDisconnect');
    };
  }, [authUser]);

  const userStatus = useCallback(
    (userId: UserId | undefined) => {
      if (!userId) {
        return 'offline';
      }
      return onlineUserIds.has(userId) ? 'online' : 'offline';
    },
    [onlineUserIds],
  );

  const contextValue = {
    userStatus,
  };

  return (
    <UserStatusContext.Provider value={contextValue}>
      {children}
    </UserStatusContext.Provider>
  );
};
