import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';
import { ButtonVariant, CustomConfirmAlert } from '../components';
import { useNavigation } from '../hooks/UseNavigation';
import { useNotificationContext } from './NotificationContext';
import {
  GameStatus,
  GameChallengeDto,
  GameChallengeStatus,
  GameStatusUpdateDto,
  GameChallengeResponseDto,
  gameQueueClientToServerWsEvents,
  gameQueueServerToClientWsEvents,
} from 'pong-engine';
import { PLAY_GAME_URL, PLAY_URL } from '../urls';
import { WsException } from '../types';
import { gameApi } from '../services/ApiService';
import { useData } from '../hooks/UseData';
import {
  GamePairingStatusDto,
  GamePairingStatusDtoGameQueueStatusEnum,
} from '../generated';

type loggerType = (arg: any) => void;

export interface GamePairingContextType {
  gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum;
  gameRoomId: string | null;
  setGameCtx?: Dispatch<SetStateAction<GamePairingContextType | null>>;
  setLogger?: Dispatch<SetStateAction<loggerType>>;
}

export const GamePairingContext = createContext<GamePairingContextType>(null!);

export const GamePairingProvider = ({ children }: { children: ReactNode }) => {
  const { authUser, isLoggedIn } = useAuth();
  const { goBack, navigate } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const [logger, setLogger] = useState<loggerType>((arg: any) => {
    warn(arg.toString());
  });
  const getPairingStatus = useCallback(() => {
    return gameApi.gameControllerGetPairingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  const { data, isLoading: isDataLoading } =
    useData<GamePairingStatusDto>(getPairingStatus);
  const [gameCtx, setGameCtx] = useState<GamePairingContextType | null>(null);
  useEffect(() => {
    setGameCtx(data);
  }, [data, isDataLoading]);

  useEffect(() => {
    const gameStatusUpdateListener = ({
      status,
      gameRoomId,
    }: GameStatusUpdateDto) => {
      switch (status) {
        // The handling of these two is similar and should be handled
        // in the same place. Hence, the fallthrough
        /* FALLTHROUGH */
        // @ts-ignore
        case GameChallengeStatus.CHALLENGE_ACCEPTED: {
          notify(`Challenge accepted`);
        } // FALLS THROUGH to GameStatus.READY
        case GameStatus.READY: {
          setGameCtx({
            gameRoomId,
            gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.Playing,
          });
          navigate(PLAY_GAME_URL);
          // `${PLAY_GAME_URL}/${gameRoomId}` should probably be the final
          // navigation, but PLAY_GAME_URL is where our game prototype waits,
          // for now
          // navigate(`${PLAY_GAME_URL}/${gameRoomId}`, { replace: true });
          break;
        }
        // The handling of these two is similar and should be handled
        // in the same place. Hence, the fallthrough
        /* FALLTHROUGH */
        // @ts-ignore
        case GameChallengeStatus.CHALLENGE_DECLINED: {
          warn(`Challenge declined`);
        } // FALLS THROUGH to GameStatus.FINISHED
        case GameStatus.FINISHED: {
          notify('Game finished');
          setGameCtx({
            gameRoomId: null,
            gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.None,
          });
          navigate(PLAY_URL, { replace: true });
        }
      }
    };

    const gameCtxUpdateListener = (data: GamePairingStatusDto) => {
      setGameCtx(data);
    };

    const challengeListener = ({
      gameRoomId,
      from: { username, id },
    }: GameChallengeDto) => {
      if (!(authUser && gameCtx)) {
        return;
      }
      if (
        gameCtx.gameQueueStatus ===
          GamePairingStatusDtoGameQueueStatusEnum.None &&
        id !== authUser.id
      ) {
        setGameCtx({
          ...gameCtx,
          gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.Waiting,
        });
        CustomConfirmAlert({
          title: 'You have a new challenge!',
          message: `${username} challenged you to play a game`,
          buttons: [
            {
              onClick: () => {
                socket.emit(
                  gameQueueClientToServerWsEvents.gameChallengeResponse,
                  {
                    gameRoomId,
                    status: GameChallengeStatus.CHALLENGE_ACCEPTED,
                  } as GameChallengeResponseDto,
                );
                notify(`Now you'll play a game against ${username}`);
                // Navigating the user from here, or changing its status to
                // playing, is not needed. Such responsibility falls on the
                // handling of gameStatus {ready} event
              },
              variant: ButtonVariant.SUBMIT,
              children: 'Accept',
            },
            {
              onClick: () => {
                socket.emit(
                  gameQueueClientToServerWsEvents.gameChallengeResponse,
                  {
                    gameRoomId,
                    status: GameChallengeStatus.CHALLENGE_DECLINED,
                  } as GameChallengeResponseDto,
                );
                setGameCtx({
                  ...gameCtx,
                  gameQueueStatus: GamePairingStatusDtoGameQueueStatusEnum.None,
                });
                // this sequence of code is not triggering any navigation,
                // but contrary to what could be intuitively assumed (at least
                // by my intuition) this is the expected and intended behaviour.
              },
              variant: ButtonVariant.WARNING,
              children: 'Decline',
            },
          ],
        });
      } else {
        socket.emit(gameQueueClientToServerWsEvents.gameChallengeResponse, {
          gameRoomId,
          status: GameChallengeStatus.CHALLENGE_DECLINED,
        } as GameChallengeResponseDto);
        // this sequence of code is not triggering any navigation,
        // but contrary to what could be intuitively assumed (at least
        // by my intuition) this is the expected and intended behaviour.
      }
    };

    socket.on('exception', (wsError: WsException) => {
      logger(wsError.message);
    });

    if (authUser) {
      socket.on(
        gameQueueServerToClientWsEvents.gameContextUpdate,
        gameCtxUpdateListener,
      );
      socket.on(
        gameQueueServerToClientWsEvents.gameStatusUpdate,
        gameStatusUpdateListener,
      );
      socket.on(
        gameQueueServerToClientWsEvents.gameChallenge,
        challengeListener,
      );
    }

    return () => {
      socket.off(gameQueueServerToClientWsEvents.gameContextUpdate);
      socket.off(gameQueueServerToClientWsEvents.gameStatusUpdate);
      socket.off(gameQueueServerToClientWsEvents.gameChallenge);
      socket.off('exception');
    };
  }, [authUser, gameCtx, navigate, goBack, warn, notify, logger]);

  const contextValue = {
    gameQueueStatus:
      gameCtx?.gameQueueStatus ?? GamePairingStatusDtoGameQueueStatusEnum.None,
    gameRoomId: gameCtx?.gameRoomId ?? null,
    setGameCtx,
    setLogger,
  };

  return (
    <GamePairingContext.Provider value={contextValue}>
      {children}
    </GamePairingContext.Provider>
  );
};
