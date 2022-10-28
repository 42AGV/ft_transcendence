import { useCallback, useState } from 'react';
import { ResponseError, User } from '../generated';
import { usersApi } from '../services/ApiService';
import { useAuth } from './UseAuth';
import { useData } from './UseData';

export function useBlock(user: User | null) {
  const { authUser } = useAuth();
  const isAuthUser =
    authUser !== null && user !== null && authUser.id === user.id;
  const [isBlocked, setIsBlocked] = useState(false);
  const getBlockStatus = useCallback(
    () =>
      isAuthUser || user === null
        ? Promise.resolve()
        : usersApi
            .userControllerGetBlock({ userId: user.id })
            .then(() => setIsBlocked(true))
            .catch((error) => {
              if (
                error instanceof ResponseError &&
                error.response.status === 404
              ) {
                setIsBlocked(false);
              } else {
                throw error;
              }
            }),
    [isAuthUser, user],
  );
  const { isLoading } = useData(getBlockStatus);

  const blockUser = async () => {
    if (!isAuthUser && user) {
      try {
        await usersApi.userControllerBlockUser({ userId: user.id });
        setIsBlocked(true);
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 422) {
          setIsBlocked(true);
        } else {
          console.error(error);
        }
      }
    }
  };

  const unblockUser = async () => {
    if (!isAuthUser && user) {
      try {
        await usersApi.userControllerUnblockUser({ userId: user.id });
        setIsBlocked(false);
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
          setIsBlocked(false);
        } else {
          console.error(error);
        }
      }
    }
  };
  return { isBlocked, isLoading, blockUser, unblockUser };
}
