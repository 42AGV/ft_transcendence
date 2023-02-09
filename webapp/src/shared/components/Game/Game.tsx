import * as React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';

import './Game.css';
import Button, { ButtonVariant } from '../Button/Button';
import { useOnlineGame } from './hooks/useOnlineGame';

type GameProps = {
  gameId: string;
};

const Play = ({ gameId }: GameProps) => {
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const {
    isPlayerOne,
    gameJoined,
    onlineGameState,
    joinGame,
    sendGameCommand,
  } = useOnlineGame(gameId);
  useGameControls(sendGameCommand);
  const score = onlineGameState?.score ?? 0;
  const opponentScore = onlineGameState?.scoreOpponent ?? 0;

  if (!gameJoined) {
    return (
      <div className="game-start">
        <Button variant={ButtonVariant.SUBMIT} onClick={joinGame}>
          Ready?
        </Button>
      </div>
    );
  }

  if (!onlineGameState) {
    return <Wait />;
  }

  if (canvasRef.current) {
    const canvasCtx = canvasRef.current.getContext('2d');
    if (canvasCtx) {
      renderMultiplayerFrame(canvasCtx, onlineGameState, isPlayerOne);
    }
  }

  return (
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOne ? opponentScore : score}
      </h1>
      <canvas
        className="game-multiplayer-arena"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOne ? score : opponentScore}
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
