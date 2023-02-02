import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';
import { ButtonVariant, CustomConfirmAlert } from '../components';
import { useNavigation } from '../hooks/UseNavigation';
import { useNotificationContext } from './NotificationContext';
import { PLAY_GAME_URL } from '../urls';

export interface GamePairingContextType {
  isWaitingToPlay: boolean;
  isPlaying: boolean;
  gameRoomId: string | null;
  setGameCtx?: Dispatch<SetStateAction<GamePairingContextType>>;
}

type GameChallengeDto = {
  gameRoomId: string;
  from: {
    username: string;
    id: string;
  };
};

enum GameChallengeStatus {
  CHALLENGE_DECLINED = 'challengeDeclined',
  CHALLENGE_ACCEPTED = 'challengeAccepted',
}

enum GameStatus {
  READY = 'ready',
  FINISHED = 'finished',
}

type GameChallengeResponseDto = {
  gameRoomId: string;
  status: GameChallengeStatus;
};

type GameAcceptedDto = {
  status: GameChallengeStatus.CHALLENGE_ACCEPTED;
  gameRoomId: string;
};

type GameReadyDto = {
  status: GameStatus.READY;
  gameRoomId: string;
};

type GameDeclinedDto = {
  status: GameChallengeStatus.CHALLENGE_DECLINED;
  gameRoomId?: never;
};

type GameFinishedDto = {
  status: GameStatus.FINISHED;
  gameRoomId?: never;
};

type GameStatusUpdateDto =
  | GameAcceptedDto
  | GameReadyDto
  | GameDeclinedDto
  | GameFinishedDto;

export const GamePairingContext = createContext<GamePairingContextType>(null!);

export const GamePairingProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const { navigate, goBack } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const [gameCtx, setGameCtx] = useState<GamePairingContextType>({
    isWaitingToPlay: false,
    isPlaying: false,
    gameRoomId: null,
  });

  useEffect(() => {
    const gameStatusUpdateListener = ({
      status,
      gameRoomId,
    }: GameStatusUpdateDto) => {
      switch (status) {
        /* FALLTHROUGH */
        // @ts-ignore
        case GameChallengeStatus.CHALLENGE_ACCEPTED: {
          notify(`Challenge accepted`);
        } // FALLS THROUGH to GameStatus.READY
        case GameStatus.READY: {
          setGameCtx({
            gameRoomId,
            isPlaying: true,
            isWaitingToPlay: false,
          });
          notify(`Now you'll play game id ${gameRoomId}`);
          // TODO: implement this navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
          break;
        }
        /* FALLTHROUGH */
        // @ts-ignore
        case GameChallengeStatus.CHALLENGE_DECLINED: {
          warn(`Challenge declined`);
        } // FALLS THROUGH to GameStatus.FINISHED
        case GameStatus.FINISHED: {
          notify('Game finished');
          setGameCtx({
            gameRoomId: null,
            isPlaying: false,
            isWaitingToPlay: false,
          });
          // TODO: implement this navigate(`${PLAY_GAME_URL}`);
        }
      }
    };

    const challengeListener = ({
      gameRoomId,
      from: { username, id },
    }: GameChallengeDto) => {
      if (authUser) {
        if (
          !gameCtx.isPlaying &&
          !gameCtx.isWaitingToPlay &&
          id !== authUser.id
        ) {
          setGameCtx({
            ...gameCtx,
            isWaitingToPlay: true,
          });
          CustomConfirmAlert({
            title: 'You have a new challenge!',
            message: `${username} challenged you to play a game`,
            buttons: [
              {
                onClick: () => {
                  socket.emit('gameChallengeResponse', {
                    gameRoomId,
                    status: GameChallengeStatus.CHALLENGE_ACCEPTED,
                  } as GameChallengeResponseDto);
                  notify(`Now you'll play a game against ${username}`);
                  // navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
                },
                variant: ButtonVariant.SUBMIT,
                children: 'Accept',
              },
              {
                onClick: () => {
                  socket.emit('gameChallengeResponse', {
                    gameRoomId,
                    status: GameChallengeStatus.CHALLENGE_DECLINED,
                  } as GameChallengeResponseDto);
                  setGameCtx({
                    ...gameCtx,
                    isWaitingToPlay: false,
                  });
                },
                variant: ButtonVariant.WARNING,
                children: 'Decline',
              },
            ],
          });
        }
      }
    };

    if (authUser) {
      socket.on('gameStatusUpdate', gameStatusUpdateListener);
      socket.on('gameChallenge', challengeListener);
    }

    return () => {
      socket.off('gameStatusUpdate');
      socket.off('gameChallenge');
    };
  }, [authUser, gameCtx, goBack, navigate, warn, notify]);

  const contextValue = useMemo(
    () => ({
      isWaitingToPlay: gameCtx.isWaitingToPlay,
      isPlaying: gameCtx.isPlaying,
      gameRoomId: gameCtx.gameRoomId,
      setGameCtx,
    }),
    [gameCtx, setGameCtx],
  );

  return (
    <GamePairingContext.Provider value={contextValue}>
      {children}
    </GamePairingContext.Provider>
  );
};
