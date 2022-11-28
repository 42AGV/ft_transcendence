import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';

type UserId = string;

export interface OnlineUsersContextType {
  onlineUserIds: Set<UserId>;
}

export const OnlineUsersContext = createContext<OnlineUsersContextType>(null!);

export const OnlineUsersProvider = ({ children }: { children: ReactNode }) => {
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

  const contextValue = useMemo(
    () => ({
      onlineUserIds,
    }),
    [onlineUserIds],
  );

  return (
    <OnlineUsersContext.Provider value={contextValue}>
      {children}
    </OnlineUsersContext.Provider>
  );
};
