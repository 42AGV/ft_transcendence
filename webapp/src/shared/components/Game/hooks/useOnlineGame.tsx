import * as React from 'react';
import socket from '../../../socket';
import { GameCommand } from 'pong-engine';

const GAME_SERVER_MESSAGE = 'gameServerMessage';

const useOnlineGame = () => {
  const sendGameCommandToServer = React.useCallback(
    (command: GameCommand) =>
      socket.emit(GAME_SERVER_MESSAGE, {
        id: 1,
        command,
      }),
    [],
  );

  const updateWithServer = React.useCallback((cb: () => void) => {
    socket.on(GAME_SERVER_MESSAGE, cb);

    return () => {
      socket.off(GAME_SERVER_MESSAGE);
    };
  }, []);

  const serverInitGameHandshake = React.useCallback((deltaTime: number) => {
    socket.emit(GAME_SERVER_MESSAGE, {
      id: 1,
      deltaTime,
    });
  }, []);

  return { sendGameCommandToServer, updateWithServer, serverInitGameHandshake };
};

export default useOnlineGame;
