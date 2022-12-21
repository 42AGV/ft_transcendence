import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { useData } from '../hooks/UseData';
import { usersApi } from '../services/ApiService';
import socket from '../socket';

type BlockedId = string;

export interface UserBlocklistContextType {
  userBlocks: (userId: string) => boolean;
}

export const UserBlocklistContext = createContext<UserBlocklistContextType>(
  null!,
);

export const UserBlocklistProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { authUser } = useAuth();
  const [blocks, setBlocks] = useState(new Set<BlockedId>());
  const getBlockedUsers = useCallback(
    () => usersApi.userControllerGetBlocks(),
    [],
  );
  const { data: blockedUsers, isLoading } = useData(getBlockedUsers);

  useEffect(() => {
    if (blockedUsers) {
      setBlocks(new Set(blockedUsers.map((user) => user.id)));
    }
  }, [blockedUsers]);

  useEffect(() => {
    const blockListener = (blockedId: BlockedId) => {
      setBlocks((prevBlocks) => new Set([...prevBlocks, blockedId]));
    };

    const unblockListener = (blockedId: BlockedId) => {
      setBlocks(
        (prevBlocks) =>
          new Set([...prevBlocks].filter((userId) => userId !== blockedId)),
      );
    };

    if (authUser) {
      socket.on('block', blockListener);
      socket.on('unblock', unblockListener);
    }

    return () => {
      socket.off('block');
      socket.off('unblock');
    };
  });

  const userBlocks = useCallback(
    (userId: string) => {
      if (isLoading) {
        return true;
      }
      return blocks.has(userId);
    },
    [isLoading, blocks],
  );

  const contextValue = {
    userBlocks,
  };

  return (
    <UserBlocklistContext.Provider value={contextValue}>
      {children}
    </UserBlocklistContext.Provider>
  );
};
