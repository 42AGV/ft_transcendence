import * as React from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GameState,
  GameCommand,
} from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';

import './Game.css';
import socket from '../../socket';
import { GameInfo, WsException } from '../../types';
import { useAuth } from '../../hooks/UseAuth';
import { useNotificationContext } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { PLAY_URL } from '../../urls';
import Button, { ButtonVariant } from '../Button/Button';

const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';
const GAME_JOINED = 'gameJoined';
const GAME_NOT_FOUND = 'gameNotFound';
const GAME_FINISHED = 'gameFinished';

type GameProps = {
  gameId: string;
};

const Play = ({ gameId }: GameProps) => {
  const { notify, warn } = useNotificationContext();
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState<number>(0);
  const [opponentScore, setOpponentScore] = React.useState<number>(0);
  const isPlayerOneRef = React.useRef(true);
  const isPlayerRef = React.useRef(false);
  const gameStateRef = React.useRef<GameState | null>(null);
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [gameJoined, setGameJoined] = React.useState(false);
  const sendGameCommand = React.useCallback(
    (command: GameCommand) => {
      if (isPlayerRef.current && gameJoined) {
        socket.emit(GAME_COMMAND, {
          command,
          gameRoomId: gameId,
        });
      }
    },
    [gameId, gameJoined],
  );
  useGameControls(sendGameCommand);

  const joinGame = () => {
    if (!gameJoined) {
      socket.emit(JOIN_GAME, { gameRoomId: gameId });
    }
  };

  React.useEffect(() => {
    return () => {
      if (gameJoined) {
        socket.emit(LEAVE_GAME, { gameRoomId: gameId });
      }
    };
  }, [gameId, gameJoined]);

  React.useEffect(() => {
    function handleGameJoined() {
      setGameJoined(true);
    }

    function handleUpdateGame(info: GameInfo) {
      gameStateRef.current = info.gameState;
      isPlayerOneRef.current = authUser?.id === info.playerOneId;
      isPlayerRef.current =
        authUser?.id === info.playerOneId || authUser?.id === info.playerTwoId;
      if (gameStateRef.current) {
        const gameState = gameStateRef.current;
        const canvasContext = canvasRef.current?.getContext('2d');

        setScore(gameState.score);
        setOpponentScore(gameState.scoreOpponent);
        canvasContext &&
          renderMultiplayerFrame(
            canvasContext,
            gameState,
            isPlayerOneRef.current,
          );
      }
    }

    function handleGameNotFound() {
      navigate(PLAY_URL, { replace: true });
    }

    function handleGameEnded() {
      notify('Game ended');
      navigate(PLAY_URL, { replace: true });
    }

    socket.on(GAME_JOINED, handleGameJoined);
    socket.on(UPDATE_GAME, handleUpdateGame);
    socket.on(GAME_NOT_FOUND, handleGameNotFound);
    socket.on(GAME_FINISHED, handleGameEnded);
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off(GAME_JOINED);
      socket.off(UPDATE_GAME);
      socket.off(GAME_NOT_FOUND);
      socket.off(GAME_FINISHED);
      socket.off('exception');
    };
  }, [authUser, renderMultiplayerFrame, navigate, notify, warn]);

  if (!gameJoined) {
    return (
      <div className="game-start">
        <Button variant={ButtonVariant.SUBMIT} onClick={joinGame}>
          Ready?
        </Button>
      </div>
    );
  }

  if (!gameStateRef.current) {
    return <Wait />;
  }

  return (
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOneRef.current ? opponentScore : score}
      </h1>
      <canvas
        className="game-multiplayer-arena"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOneRef.current ? score : opponentScore}
      </h1>
    </div>
  );
};

const Wait = () => {
  return (
    <div className="game-wait">
      <GameSpinner scaleInPercent={150} />
      <div className="game-wait-text">
        <Text variant={TextVariant.PARAGRAPH}>Loading game...</Text>
      </div>
    </div>
  );
};

export default function Game({ gameId }: GameProps) {
  const { goBack } = useNavigation();
  return (
    <GameStateContextProvider>
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={() => {
          goBack();
        }}
      >
        Hit the brick!
      </Header>
      <div className="game">
        <Play gameId={gameId} />
      </div>
    </GameStateContextProvider>
  );
}
