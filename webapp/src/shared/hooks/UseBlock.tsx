import { useCallback, useEffect, useReducer } from 'react';
import { ResponseError, UserResponseDto } from '../generated';
import { usersApi } from '../services/ApiService';

export type BlockRelation = {
  isUserBlocked: boolean;
  amIBlocked: boolean;
};

type BlockAction =
  | { type: 'FILL_BLOCK_RELATION'; isUserBlocked: boolean; amIBlocked: boolean }
  | { type: 'BLOCK_USER' }
  | { type: 'UNBLOCK_USER' };

const blockReducerCallback = (
  state: BlockRelation | null,
  action: BlockAction,
): BlockRelation | null => {
  const { type } = action;

  if (type === 'FILL_BLOCK_RELATION') {
    return {
      isUserBlocked: action.isUserBlocked,
      amIBlocked: action.amIBlocked,
    };
  }

  if (!state) {
    return null;
  }

  if (type === 'BLOCK_USER') {
    return {
      ...state,
      isUserBlocked: true,
    };
  } else if (type === 'UNBLOCK_USER') {
    return {
      ...state,
      isUserBlocked: false,
    };
  }
  throw new Error('Unknown block reducer action');
};

export function useBlock(user: UserResponseDto | null) {
  const [blockRelation, dispatch] = useReducer(blockReducerCallback, null);

  useEffect(() => {
    if (user && user.blockRelation) {
      dispatch({
        type: 'FILL_BLOCK_RELATION',
        isUserBlocked: user.blockRelation.isUserBlockedByMe,
        amIBlocked: user.blockRelation.amIBlockedByUser,
      });
    }
  }, [user]);

  const blockUser = useCallback(async () => {
    if (user) {
      try {
        await usersApi.userControllerBlockUser({ userId: user.id });
        dispatch({ type: 'BLOCK_USER' });
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 422) {
          dispatch({ type: 'BLOCK_USER' });
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
        dispatch({ type: 'UNBLOCK_USER' });
      } catch (error) {
        if (error instanceof ResponseError && error.response.status === 404) {
          dispatch({ type: 'UNBLOCK_USER' });
        } else {
          console.error(error);
        }
      }
    }
  }, [user]);

  return { blockRelation, blockUser, unblockUser };
}
