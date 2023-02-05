import * as React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from 'pong-engine';
import {
  useGameControls,
  useGameAnimation,
  useGameEngine,
  useOnlineGame,
} from './hooks';
import { GameStateContextProvider } from './context';
import {
  StateMachineContextProvider,
  useStateMachineContext,
} from './state-machine/context';
import Button, { ButtonVariant } from '../Button/Button';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';

import './Game.css';

const Play = () => {
  const { renderFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const [score, setScore] = React.useState<number>(0);
  const { sendGameCommand, updateGame } = useOnlineGame();
  // Refactor para decorar o hacer HOC con estos componentes
  // De esta forma usar versión online de los controles y versión online del gameEngine
  // usamos hook online dentro de la versión decorada
  useGameControls(sendGameCommand);
  const { runGameFrame } = useGameEngine(updateGame);

  const gameLoop = React.useCallback(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    const gameState = runGameFrame();

    setScore(gameState.score);
    canvasContext && renderFrame(canvasContext, gameState);
    window.requestAnimationFrame(() => gameLoop());
  }, [runGameFrame, renderFrame]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      requestFrameRef.current = window.requestAnimationFrame(() => gameLoop());

      return () => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current);
        }
      };
    }
  }, [gameLoop]);

  return (
    <>
      <h1 className="game-score heading-bold">{score}</h1>
      <canvas className="game-arena" ref={canvasRef} />
    </>
  );
};

const Start = () => {
  const { send } = useStateMachineContext();

  return (
    <div className="game-start">
      <Button variant={ButtonVariant.SUBMIT} onClick={() => send('READY')}>
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

const Game = () => {
  const { state } = useStateMachineContext();

  const drawMachineState = (): JSX.Element => {
    switch (state.value) {
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

export default function GameWithContext() {
  const { initHandshake, handleInitHandshake, leaveGame } = useOnlineGame();
  const { goBack } = useNavigation();

  const handshake = React.useCallback((): Promise<string> => {
    initHandshake();

    return new Promise((resolve) => {
      const handler = (handshake: { res: string }) => {
        resolve(handshake.res);
      };
      handleInitHandshake(handler);
    });
  }, [initHandshake, handleInitHandshake]);

  return (
    <>
      {/* TODO , this is a temporal fix, replace with a menu */}
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={() => {
          leaveGame();
          goBack();
        }}
      >
        Hit the brick!
      </Header>
      <GameStateContextProvider>
        <StateMachineContextProvider services={{ handshake }}>
          <Game />
        </StateMachineContextProvider>
      </GameStateContextProvider>
    </>
  );
}
