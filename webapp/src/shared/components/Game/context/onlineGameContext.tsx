import * as React from 'react';
import socket from '../../../socket';
import { GameCommand, GameState } from 'pong-engine';
import { WsException } from '../../../types';
import { useNotificationContext } from '../../../context/NotificationContext';
import { Socket } from 'socket.io-client';
import DefaultEventsMap from 'socket.io-client';

// Tipar mensajes ws -> investigar si se puede hacer con OpenApi
const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';

type DefaultEventsMapType = typeof DefaultEventsMap;

type ContextType = {
  gameRoomIdRef: React.MutableRefObject<string>;
  sendGameCommand: (
    command: GameCommand,
  ) => Socket<DefaultEventsMapType, DefaultEventsMapType>;
  updateGame: (cb: (state: GameState) => void) => () => void;
  initHandshake: () => void;
  handleInitHandshake: (cb: (handshake: { res: string }) => void) => () => void;
  leaveGame: () => void;
  handleLeaveHandshake: (
    cb: (handshake: { res: string }) => void,
  ) => () => void;
};

type ContextProps = {
  gameRoomId: string;
  children: React.ReactNode;
};

const OnlineStateContext = React.createContext<ContextType | undefined>(
  undefined,
);

export const OnlineGameContextProvider = ({
  gameRoomId,
  children,
}: ContextProps) => {
  const gameRoomIdRef = React.useRef<string>(gameRoomId);
  const { warn } = useNotificationContext();

  const sendGameCommand = React.useCallback(
    (command: GameCommand) =>
      socket.emit(GAME_COMMAND, {
        command,
        gameRoomId: gameRoomIdRef.current,
      }),
    [],
  );

  const updateGame = React.useCallback((cb: (state: GameState) => void) => {
    socket.on(UPDATE_GAME, cb);

    return () => {
      socket.off(UPDATE_GAME);
    };
  }, []);

  const initHandshake = React.useCallback(() => {
    socket.emit(JOIN_GAME, {
      gameRoomId: gameRoomIdRef.current,
    });
  }, []);

  const handleInitHandshake = React.useCallback(
    (cb: (handshake: { res: string }) => void) => {
      socket.on(JOIN_GAME, cb);

      return () => {
        socket.off(JOIN_GAME);
      };
    },
    [],
  );

  const leaveGame = React.useCallback(() => {
    socket.emit(LEAVE_GAME, {
      gameRoomId: gameRoomIdRef.current,
    });
  }, []);

  const handleLeaveHandshake = React.useCallback(
    (cb: (handshake: { res: string }) => void) => {
      socket.on(LEAVE_GAME, cb);

      return () => {
        socket.off(LEAVE_GAME);
      };
    },
    [],
  );

  React.useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off('exception');
    };
  }, [warn]);

  return (
    <OnlineStateContext.Provider
      value={{
        gameRoomIdRef,
        sendGameCommand,
        updateGame,
        initHandshake,
        handleInitHandshake,
        leaveGame,
        handleLeaveHandshake,
      }}
    >
      {children}
    </OnlineStateContext.Provider>
  );
};

export function useOnlineGameContext() {
  const context = React.useContext(OnlineStateContext);
  if (context === undefined) {
    throw new Error(
      'useGameOnlineContext must be within GameOnlineContextProvider',
    );
  }
  return context;
}
