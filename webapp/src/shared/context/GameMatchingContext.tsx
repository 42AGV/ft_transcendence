import { createContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import socket from '../socket';
import { ButtonVariant, CustomConfirmAlert } from '../components';
import { useNavigation } from '../hooks/UseNavigation';
import { useNotificationContext } from './NotificationContext';

export interface GameMatchingContextType {
  isWaitingToPlay: boolean;
  isPlaying: boolean;
  gameRoomId: string | null;
}

type GameChallengeDto = {
  // Draft example
  gameRoomId: string;
  challengerUserName: string;
  challengerUserId: string;
}; // TODO: this is a draft. Implement this

type GameChallengeResponseDto = {
  to: string;
  accepted: boolean;
}; // TODO: this is a draft. Implement this

type GameReadyDto = {
  accepted: boolean;
  gameRoomId: string;
}; // TODO: this is a draft. Implement this

export const GameMatchingContext = createContext<GameMatchingContextType>(
  null!,
);

export const GameMatchProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useAuth();
  const { navigate, goBack } = useNavigation();
  const { warn, notify } = useNotificationContext();
  const [gameCtx, setGameCtx] = useState<GameMatchingContextType>({
    isWaitingToPlay: false,
    isPlaying: false,
    gameRoomId: null,
  });
  const { isWaitingToPlay, isPlaying, gameRoomId } = gameCtx;
  useEffect(() => {
    const gameReadyListener = ({ accepted, gameRoomId }: GameReadyDto) => {
      if (accepted) {
        setGameCtx({
          gameRoomId: gameRoomId,
          isPlaying: true,
          isWaitingToPlay: false,
        });
        notify(`Now you'll play game id ${gameRoomId}`);
        // navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
      } else {
        warn('Game challenged declined');
        setGameCtx({
          gameRoomId: null,
          isPlaying: false,
          isWaitingToPlay: false,
        });
        goBack(); // TODO: maybe navigate to somewhere in particular
      }
    };

    const challengeListener = ({
      gameRoomId,
      challengerUserId,
      challengerUserName,
    }: GameChallengeDto) => {
      if (authUser) {
        if (
          !isPlaying &&
          !isWaitingToPlay &&
          challengerUserId !== authUser.id
        ) {
          CustomConfirmAlert({
            title: 'You have a new challenge!',
            message: `${challengerUserName} challenged you to play a game`,
            buttons: [
              {
                onClick: () => {
                  socket.emit('gameChallengeRawResponse', {
                    to: gameRoomId,
                    accepted: true,
                  } as GameChallengeResponseDto);
                  setGameCtx({
                    gameRoomId: gameRoomId,
                    isPlaying: true,
                    isWaitingToPlay: false,
                  });
                  notify(`Now you'll play game id ${gameRoomId}`);
                  // navigate(`${PLAY_GAME_URL}/${gameRoomId}`);
                },
                variant: ButtonVariant.SUBMIT,
                children: 'Accept',
              },
              {
                onClick: () => {
                  socket.emit('gameChallengeRawResponse', {
                    to: gameRoomId,
                    accepted: false,
                  } as GameChallengeResponseDto);
                  setGameCtx({
                    gameRoomId: null,
                    isPlaying: false,
                    isWaitingToPlay: false,
                  });
                },
                variant: ButtonVariant.WARNING,
                children: 'Decline',
              },
            ],
          });
        } else if (challengerUserId !== authUser.id) {
          socket.emit('gameChallengeResponse', {
            to: gameRoomId,
            accepted: false,
          } as GameChallengeResponseDto);
        }
      }
    }; // TODO: this is a draft. Implement this

    if (authUser) {
      socket.on('gameReady', gameReadyListener);
      socket.on('gameChallengeResponse', gameReadyListener);
      socket.on('gameChallenge', challengeListener);
    }

    return () => {
      socket.off('gameReady');
      socket.off('gameChallenge');
      socket.off('gameChallengeResponse');
    };
  }, [
    authUser,
    gameCtx,
    goBack,
    isPlaying,
    isWaitingToPlay,
    navigate,
    warn,
    notify,
  ]);

  const contextValue = {
    isWaitingToPlay,
    isPlaying,
    gameRoomId,
  };

  return (
    <GameMatchingContext.Provider value={contextValue}>
      {children}
    </GameMatchingContext.Provider>
  );
};
