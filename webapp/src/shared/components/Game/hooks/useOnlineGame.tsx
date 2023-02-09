import * as React from 'react';
import socket from '../../../socket';
import { GameCommand, GameState } from 'pong-engine';

// Tipar mensajes ws -> investigar si se puede hacer con OpenApi
const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';

const useOnlineGame = () => {
  const sendGameCommand = React.useCallback(
    (command: GameCommand) =>
      socket.emit(GAME_COMMAND, {
        command,
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
    socket.emit(JOIN_GAME);
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
    socket.emit(LEAVE_GAME);
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

  return {
    sendGameCommand,
    updateGame,
    initHandshake,
    handleInitHandshake,
    leaveGame,
    handleLeaveHandshake,
  };
};

export default useOnlineGame;
