import React from 'react';
import { useNotificationContext } from '../../../context/NotificationContext';
import {
  DragPayload,
  GameCommand,
  GameInfoClient,
  GameState,
  GameMode,
} from 'pong-engine';
import { useAuth } from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import socket from '../../../socket';
import { PLAY_URL } from '../../../urls';
import { User } from '../../../generated';

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
const SHOULD_CONFIGURE_GAME = 'shouldConfigureGame';
const GET_SHOULD_CONFIGURE_GAME = 'getShouldConfigureGame';
const GAME_CONFIG_SUBMIT = 'gameConfigSubmit';
const MAX_CONNECTION_LAG_IN_MS = 100;

export function useOnlineGame(gameId: string) {
  const { notify, warn } = useNotificationContext();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [isPlayer, setIsPlayer] = React.useState(false);
  const [isPlayerOne, setIsPlayerOne] = React.useState(true);
  const [onlineGameState, setOnlineGameState] =
    React.useState<GameState | null>(null);
  const [gameMode, setGameMode] = React.useState<GameMode | null>(null);
  const [gameJoined, setGameJoined] = React.useState(false);
  const [playerOne, setPlayerOne] = React.useState<User | null>(null);
  const [playerTwo, setPlayerTwo] = React.useState<User | null>(null);
  const [isGamePaused, setIsGamePaused] = React.useState<boolean>(false);
  const [shouldConfigureGame, setShouldConfigureGame] = React.useState<
    boolean | null
  >(null);
  const updateTimestamp = React.useRef<number | undefined>();

  const sendGameCommand = React.useCallback(
    (command: GameCommand, payload?: DragPayload) => {
      if (isPlayer && gameJoined) {
        socket.emit(GAME_COMMAND, {
          command,
          gameRoomId: gameId,
          payload,
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

  const submitGameConfig = React.useCallback(
    (gameMode: GameMode) => {
      if (shouldConfigureGame) {
        socket.emit(GAME_CONFIG_SUBMIT, { gameRoomId: gameId, gameMode });
      }
    },
    [gameId, shouldConfigureGame],
  );

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    function handleGameJoined({
      gameInfo,
      playerOne,
      playerTwo,
    }: {
      gameInfo: GameInfoClient;
      playerOne: User;
      playerTwo: User;
    }) {
      setIsPlayer(
        authUser?.id === gameInfo.playerOneId ||
          authUser?.id === gameInfo.playerTwoId,
      );
      setIsPlayerOne(authUser?.id === gameInfo.playerOneId);
      setGameJoined(true);
      setPlayerOne(playerOne);
      setPlayerTwo(playerTwo);
    }

    function handleUpdateGame(info: GameInfoClient) {
      const now = Date.now();
      if (updateTimestamp.current) {
        now - updateTimestamp.current > MAX_CONNECTION_LAG_IN_MS &&
          warn('slow connection', 'top');
      }
      updateTimestamp.current = now;
      setOnlineGameState(info.gameState);
      setGameMode(info.gameMode);
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
      setIsGamePaused(true);
      notify('Waiting for players to join');
    }

    function handleGameStartResumed() {
      setIsGamePaused(false);
      notify('Game starting soon');
    }

    function handleGamePaused() {
      setIsGamePaused(true);
      notify('Game paused');
    }

    function handleGameResumed() {
      setIsGamePaused(false);
      notify('Game resuming soon');
    }

    function handleShouldGameConfigure(shouldConfigure: boolean) {
      setShouldConfigureGame(shouldConfigure);
    }

    socket.on(GAME_JOINED, handleGameJoined);
    socket.on(UPDATE_GAME, handleUpdateGame);
    socket.on(GAME_NOT_FOUND, handleGameNotFound);
    socket.on(GAME_FINISHED, handleGameFinished);
    socket.on(GAME_START_PAUSED, handleGameStartPaused);
    socket.on(GAME_START_RESUMED, handleGameStartResumed);
    socket.on(GAME_PAUSED, handleGamePaused);
    socket.on(GAME_RESUMED, handleGameResumed);
    socket.on(SHOULD_CONFIGURE_GAME, handleShouldGameConfigure);
    socket.emit(GET_SHOULD_CONFIGURE_GAME);

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
      socket.off(SHOULD_CONFIGURE_GAME);
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
    playerOne,
    playerTwo,
    isGamePaused,
    shouldConfigureGame,
    submitGameConfig,
    gameMode,
  };
}
