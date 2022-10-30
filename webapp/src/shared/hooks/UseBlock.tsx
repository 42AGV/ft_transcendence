import { useCallback, useEffect, useState } from 'react';
import { ResponseError, UserDto } from '../generated';
import { usersApi } from '../services/ApiService';

export function useBlock(user: UserDto | null) {
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      setIsBlocked(user.isBlocked ?? null);
    }
  }, [user]);

  const blockUser = useCallback(async () => {
    if (user) {
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
  }, [user]);

  const unblockUser = useCallback(async () => {
    if (user) {
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
  }, [user]);

  return { isBlocked, blockUser, unblockUser };
}
