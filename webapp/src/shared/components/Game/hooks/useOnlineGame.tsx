import React from 'react';
import { useNotificationContext } from '../../../context/NotificationContext';
import { GameCommand, GameInfoClient, GameState } from 'pong-engine';
import { useAuth } from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import socket from '../../../socket';
import { PLAY_URL } from '../../../urls';

const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';
const GAME_JOINED = 'gameJoined';
const GAME_NOT_FOUND = 'gameNotFound';
const GAME_FINISHED = 'gameFinished';
const ENDGAME_REDIRECT_DELAY_MS = 2000;

export function useOnlineGame(gameId: string) {
  const { notify, warn } = useNotificationContext();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [isPlayer, setIsPlayer] = React.useState(false);
  const [isPlayerOne, setIsPlayerOne] = React.useState(true);
  const [onlineGameState, setOnlineGameState] =
    React.useState<GameState | null>(null);
  const [gameJoined, setGameJoined] = React.useState(false);

  const sendGameCommand = React.useCallback(
    (command: GameCommand) => {
      if (isPlayer && gameJoined) {
        socket.emit(GAME_COMMAND, {
          command,
          gameRoomId: gameId,
        });
      }
    },
    [gameId, isPlayer, gameJoined],
  );

  const joinGame = React.useCallback(() => {
    if (!gameJoined) {
      socket.emit(JOIN_GAME, { gameRoomId: gameId });
    }
  }, [gameId, gameJoined]);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    function handleGameJoined(info: GameInfoClient) {
      setIsPlayer(
        authUser?.id === info.playerOneId || authUser?.id === info.playerTwoId,
      );
      setIsPlayerOne(authUser?.id === info.playerOneId);
      setGameJoined(true);
    }

    function handleUpdateGame(info: GameInfoClient) {
      setOnlineGameState(info.gameState);
    }

    function handleGameNotFound() {
      navigate(PLAY_URL, { replace: true });
    }

    function handleGameFinished(info: GameInfoClient) {
      setOnlineGameState(info.gameState);
      notify('Game finished');
      timeoutId = setTimeout(() => {
        navigate(PLAY_URL, { replace: true });
      }, ENDGAME_REDIRECT_DELAY_MS);
    }

    socket.on(GAME_JOINED, handleGameJoined);
    socket.on(UPDATE_GAME, handleUpdateGame);
    socket.on(GAME_NOT_FOUND, handleGameNotFound);
    socket.on(GAME_FINISHED, handleGameFinished);

    return () => {
      socket.emit(LEAVE_GAME, { gameRoomId: gameId });
      socket.off(GAME_JOINED);
      socket.off(UPDATE_GAME);
      socket.off(GAME_NOT_FOUND);
      socket.off(GAME_FINISHED);
      clearTimeout(timeoutId);
    };
  }, [
    gameId,
    authUser,
    navigate,
    notify,
    warn,
    setIsPlayer,
    setIsPlayerOne,
    setOnlineGameState,
  ]);

  return {
    isPlayerOne,
    gameJoined,
    onlineGameState,
    joinGame,
    sendGameCommand,
  };
}
