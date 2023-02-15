import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';
import { PlayerIds } from 'transcendence-shared';

type UserId = string;

export type UserStatus = 'online' | 'offline' | 'playing';

export interface UserStatusContextType {
  userStatus: (userId: UserId | undefined) => UserStatus;
}

export const UserStatusContext = createContext<UserStatusContextType>(null!);

export const UserStatusProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState(new Set<UserId>());
  const [playingUserIds, setPlayingUserIds] = useState(new Set<UserId>());

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

    const playingUsersListener = (userIds: UserId[]) => {
      setPlayingUserIds(new Set(userIds));
    };

    const addPlayingUsersListener = ({
      playerOneId,
      playerTwoId,
    }: PlayerIds) => {
      setPlayingUserIds(
        (prevPlayerIds) =>
          new Set([...prevPlayerIds, playerOneId, playerTwoId]),
      );
    };

    const removePlayingUsersListener = ({
      playerOneId,
      playerTwoId,
    }: PlayerIds) => {
      setPlayingUserIds(
        (prevPlayerIds) =>
          new Set(
            [...prevPlayerIds].filter(
              (id) => id !== playerOneId && id !== playerTwoId,
            ),
          ),
      );
    };

    if (authUser) {
      socket.on('onlineUsers', onlineUsersListener);
      socket.on('userConnect', userConnectListener);
      socket.on('userDisconnect', userDisconnectListener);
      socket.on('playingUsers', playingUsersListener);
      socket.on('addPlayingUsers', addPlayingUsersListener);
      socket.on('removePlayingUsers', removePlayingUsersListener);
      socket.emit('getPlayingUsers');
      socket.emit('getOnlineUsers');
    }

    return () => {
      socket.off('onlineUsers');
      socket.off('userConnect');
      socket.off('userDisconnect');
      socket.off('playingUsers');
      socket.off('addPlayingUsers');
      socket.off('removePlayingUsers');
    };
  }, [authUser]);

  const userStatus = useCallback(
    (userId: UserId | undefined) => {
      if (!userId) {
        return 'offline';
      }
      if (playingUserIds.has(userId)) {
        return 'playing';
      }
      return onlineUserIds.has(userId) ? 'online' : 'offline';
    },
    [playingUserIds, onlineUserIds],
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
