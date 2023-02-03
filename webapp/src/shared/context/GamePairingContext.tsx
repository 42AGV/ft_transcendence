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
import {
  GameStatus,
  GameChallengeDto,
  GameChallengeStatus,
  GameStatusUpdateDto,
  GameChallengeResponseDto,
  gameQueueClientToServerWsEvents,
  gameQueueServerToClientWsEvents,
} from 'pong-engine';
import { useLocation } from 'react-router-dom';
import { PLAY_GAME_QUEUE, PLAY_GAME_URL } from '../urls';

export interface GamePairingContextType {
  isWaitingToPlay: boolean;
  isPlaying: boolean;
  gameRoomId: string | null;
  setGameCtx?: Dispatch<SetStateAction<GamePairingContextType>>;
}

export const GamePairingContext = createContext<GamePairingContextType>(null!);

export const GamePairingProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isInQueuePage =
    pathname.slice(0, PLAY_GAME_QUEUE.length) === PLAY_GAME_QUEUE;
  const isInGamePage =
    pathname.slice(0, PLAY_GAME_URL.length + 1) === `${PLAY_GAME_URL}/`;
  const { authUser } = useAuth();
  const { goBack, navigate } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const [gameCtx, setGameCtx] = useState<GamePairingContextType>({
    isWaitingToPlay: false,
    isPlaying: false,
    gameRoomId: null,
  });

  useEffect(() => {
    if (gameCtx.isPlaying && !isInGamePage) {
      navigate(`${PLAY_GAME_URL}/${gameCtx.gameRoomId}`);
    }

    if (gameCtx.isWaitingToPlay && !isInQueuePage) {
      navigate(PLAY_GAME_QUEUE);
    }
    if (!gameCtx.isWaitingToPlay && isInQueuePage) {
      goBack();
    }
    if (!gameCtx.isPlaying && isInGamePage) {
      goBack();
    }
  }, [navigate, gameCtx, isInGamePage, isInQueuePage, goBack]);

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
            isPlaying: true,
            isWaitingToPlay: false,
          });
          notify(`Now you'll play game id ${gameRoomId}`);
          // TODO: implement this navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
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
                    isWaitingToPlay: false,
                  });
                  goBack(); // TODO: review where does the goBack() point to.
                  // We're automatically redirected to queue page when we're
                  // waiting, so this should take us back to wherever we were.
                  // but since the alert will be overlayed, maybe we won't
                  // navigate to queue page? Check this
                },
                variant: ButtonVariant.WARNING,
                children: 'Decline',
              },
            ],
          });
        } else {
          console.log('hitting this');
          socket.emit(gameQueueClientToServerWsEvents.gameChallengeResponse, {
            gameRoomId,
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameChallengeResponseDto);
        }
      }
    };

    if (authUser) {
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
      socket.off(gameQueueServerToClientWsEvents.gameStatusUpdate);
      socket.off(gameQueueServerToClientWsEvents.gameChallenge);
    };
  }, [authUser, gameCtx, navigate, goBack, warn, notify]);

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
