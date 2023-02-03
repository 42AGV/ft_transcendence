import * as React from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GameState,
  GameCommand,
} from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
import Button, { ButtonVariant } from '../Button/Button';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';

import './Game.css';
import { StateMachineContext } from './state-machine/context';
import { GameEvent, gameMachine } from './state-machine/machine';
import socket from '../../socket';
import { GameInfo } from '../../types';
import { useAuth } from '../../hooks/UseAuth';
import { Sender } from 'xstate';

const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';

const Play = () => {
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState<number>(0);
  const [opponentScore, setOpponentScore] = React.useState<number>(0);
  const isPlayerOneRef = React.useRef(false);
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const gameId = StateMachineContext.useSelector(
    (state) => state.context.gameId,
  );
  const sendGameCommand = React.useCallback(
    (command: GameCommand) =>
      socket.emit(GAME_COMMAND, {
        command,
        gameRoomId: gameId,
      }),
    [gameId],
  );
  useGameControls(sendGameCommand);
  const { authUser } = useAuth();

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  React.useEffect(() => {
    function updateGame(info: GameInfo) {
      setGameState(info.state);
      isPlayerOneRef.current = authUser?.id === info.playerOneId;
    }

    socket.on(UPDATE_GAME, updateGame);

    return () => {
      socket.off(UPDATE_GAME);
    };
  }, [authUser]);

  if (gameState) {
    const canvasContext = canvasRef.current?.getContext('2d');

    setScore(gameState.score);
    setOpponentScore(gameState.scoreOpponent);
    canvasContext &&
      renderMultiplayerFrame(canvasContext, gameState, isPlayerOneRef.current);
  }

  return (
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">{opponentScore}</h1>
      <canvas className="game-multiplayer-arena" ref={canvasRef} />
      <h1 className="game-multiplayer-score heading-bold">{score}</h1>
    </div>
  );
};

const Start = () => {
  const actorRef = StateMachineContext.useActorRef();

  return (
    <div className="game-start">
      <Button
        variant={ButtonVariant.SUBMIT}
        onClick={() => actorRef.send('READY')}
      >
        Ready?
      </Button>
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

const StateMachine = () => {
  const value = StateMachineContext.useSelector((state) => state.value);

  const drawMachineState = (): JSX.Element => {
    switch (value) {
      case 'start':
        return <Start />;
      case 'wait':
        return <Wait />;
      case 'play':
        return <Play />;
      // case 'end':
      //   return <End />;
      default:
        return <Start />;
    }
  };

  return <div className="game">{drawMachineState()}</div>;
};

type GameProps = {
  gameId: string;
};

const Game = ({ gameId }: GameProps) => {
  const { goBack } = useNavigation();

  const handshake = React.useCallback(
    () => (send: Sender<GameEvent>) => {
      const handshakeListener = (payload: { res: string }) => {
        console.log(payload);
        if (payload.res === 'ok') {
          send('READY');
        }
      };
      console.log('Handshake called');

      socket.on(JOIN_GAME, handshakeListener);

      return () => {
        socket.off(JOIN_GAME);
      };
    },
    [],
  );

  React.useEffect(() => {
    socket.emit(JOIN_GAME, { gameRoomId: gameId });

    return () => {
      socket.emit(LEAVE_GAME, { gameRoomId: gameId });
    };
  }, [gameId]);

  return (
    <StateMachineContext.Provider
      machine={() =>
        gameMachine
          .withConfig({
            services: { handshake },
          })
          .withContext({ gameId })
      }
    >
      {/* TODO , this is a temporal fix, replace with a menu */}
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={() => {
          goBack();
        }}
      >
        Hit the brick!
      </Header>
      <StateMachine />
    </StateMachineContext.Provider>
  );
};

export default function GameWithContext({ gameId }: GameProps) {
  return (
    <>
      <GameStateContextProvider>
        <Game gameId={gameId} />
      </GameStateContextProvider>
    </>
  );
}
