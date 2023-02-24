import * as React from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GameState,
  GameCommand,
  DragPayload,
  GameMode,
} from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';
import Button, { ButtonVariant } from '../Button/Button';
import { useOnlineGame } from './hooks/useOnlineGame';
import Score from '../Score/Score';
import { AVATAR_EP_URL } from '../../urls';
import { User } from '../../generated';
import RowsList, { RowItem } from '../RowsList/RowsList';

import './Game.css';

type GameProps = {
  gameId: string;
};

type GameStatusHandlerProps = {
  gameId: string;
};

type PlayProps = {
  isPlayerOne: boolean;
  onlineGameState: GameState;
  gameMode: GameMode | null;
  playerOne: User | null;
  playerTwo: User | null;
  sendGameCommand: (
    command: GameCommand,
    payload?: DragPayload | undefined,
  ) => void;
};

type ConfigureGameProps = {
  submitGameConfig: (gameMode: GameMode) => void;
  joinGame: () => void;
};

const GameStatusHandler = ({ gameId }: GameStatusHandlerProps) => {
  const {
    gameJoined,
    joinGame,
    isPlayerOne,
    isGamePaused,
    onlineGameState,
    gameMode,
    playerOne,
    playerTwo,
    sendGameCommand,
    shouldConfigureGame,
    submitGameConfig,
  } = useOnlineGame(gameId);

  if (shouldConfigureGame) {
    return (
      <ConfigureGame submitGameConfig={submitGameConfig} joinGame={joinGame} />
    );
  }

  if (!gameJoined) {
    return (
      <div className="game-start">
        <Button variant={ButtonVariant.SUBMIT} onClick={joinGame}>
          Ready?
        </Button>
      </div>
    );
  }

  if (!onlineGameState || isGamePaused) {
    return <Wait />;
  }

  return (
    <Play
      isPlayerOne={isPlayerOne}
      onlineGameState={onlineGameState}
      gameMode={gameMode}
      playerOne={playerOne}
      playerTwo={playerTwo}
      sendGameCommand={sendGameCommand}
    />
  );
};

const Play = ({
  isPlayerOne,
  onlineGameState,
  gameMode,
  playerOne,
  playerTwo,
  sendGameCommand,
}: PlayProps) => {
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useGameControls(sendGameCommand);
  const score = onlineGameState?.score ?? 0;
  const opponentScore = onlineGameState?.scoreOpponent ?? 0;

  if (canvasRef.current) {
    const canvasCtx = canvasRef.current.getContext('2d');
    if (canvasCtx) {
      renderMultiplayerFrame(canvasCtx, onlineGameState, isPlayerOne, gameMode);
    }
  }

  return (
    <div className="game-multiplayer">
      <div className="game-multiplayer-score">
        <Score
          playerOneAvatar={{
            url: `${AVATAR_EP_URL}/${playerOne!.avatarId}`,
            XCoordinate: playerOne!.avatarX,
            YCoordinate: playerOne!.avatarY,
          }}
          playerOneScore={score}
          playerOneUserName={playerOne!.username}
          playerTwoAvatar={{
            url: `${AVATAR_EP_URL}/${playerTwo!.avatarId}`,
            XCoordinate: playerTwo!.avatarX,
            YCoordinate: playerTwo!.avatarY,
          }}
          playerTwoScore={opponentScore}
          playerTwoUserName={playerTwo!.username}
        />
      </div>
      <canvas
        className="game-multiplayer-arena"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  );
};

const ConfigureGame = ({ submitGameConfig, joinGame }: ConfigureGameProps) => {
  const rowsData: RowItem[] = [
    {
      onClick: () => {
        submitGameConfig('classic');
        joinGame();
      },
      title: 'Classic game',
      key: 'Classic game',
      iconVariant: IconVariant.PLAY,
    },
    {
      onClick: () => {
        submitGameConfig('shortPaddle');
        joinGame();
      },
      title: 'Short paddle',
      key: 'Short paddle',
      iconVariant: IconVariant.ARROW_FORWARD,
    },
    {
      onClick: () => {
        submitGameConfig('mysteryZone');
        joinGame();
      },
      title: 'Mystery zone',
      key: 'Mystery zone',
      iconVariant: IconVariant.ADD,
    },
  ];
  return (
    <div className="game-start">
      <Text variant={TextVariant.SUBHEADING}>Select a game mode</Text>
      <RowsList rows={rowsData} />
    </div>
  );
};

const Wait = () => (
  <div className="game-wait">
    <GameSpinner scaleInPercent={150} />
    <div className="game-wait-text">
      <Text variant={TextVariant.PARAGRAPH}>Waiting for opponent...</Text>
    </div>
  </div>
);

export default function Game({ gameId }: GameProps) {
  const { goBack } = useNavigation();
  return (
    <GameStateContextProvider>
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        Quick match!
      </Header>
      <div className="game">
        <GameStatusHandler gameId={gameId} />
      </div>
    </GameStateContextProvider>
  );
}
