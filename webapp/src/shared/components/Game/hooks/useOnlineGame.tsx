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
const GAME_FINISHED_REDIRECT_DELAY_MS = 2000;
const GAME_START_PAUSED = 'gameStartPaused';
const GAME_START_RESUMED = 'gameStartResumed';
const GAME_PAUSED = 'gamePaused';
const GAME_RESUMED = 'gameResumed';

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
      }, GAME_FINISHED_REDIRECT_DELAY_MS);
    }

    function handleGameStartPaused() {
      notify('Waiting for player to join');
    }

    function handleGameStartResumed() {
      notify('Game starting soon');
    }

    function handleGamePaused() {
      notify('Game paused');
    }

    function handleGameResumed() {
      notify('Game resuming soon');
    }

    socket.on(GAME_JOINED, handleGameJoined);
    socket.on(UPDATE_GAME, handleUpdateGame);
    socket.on(GAME_NOT_FOUND, handleGameNotFound);
    socket.on(GAME_FINISHED, handleGameFinished);
    socket.on(GAME_START_PAUSED, handleGameStartPaused);
    socket.on(GAME_START_RESUMED, handleGameStartResumed);
    socket.on(GAME_PAUSED, handleGamePaused);
    socket.on(GAME_RESUMED, handleGameResumed);

    return () => {
      socket.emit(LEAVE_GAME, { gameRoomId: gameId });
      socket.off(GAME_JOINED);
      socket.off(UPDATE_GAME);
      socket.off(GAME_NOT_FOUND);
      socket.off(GAME_FINISHED);
      socket.off(GAME_START_PAUSED);
      socket.off(GAME_START_RESUMED);
      socket.off(GAME_PAUSED);
      socket.off(GAME_RESUMED);
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
