import * as React from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GameState,
  GameCommand,
} from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
// import Button, { ButtonVariant } from '../Button/Button';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';

import './Game.css';
import { StateMachineContext } from './state-machine/context';
// import { GameEvent, gameMachine } from './state-machine/machine';
import socket from '../../socket';
import { GameInfo, WsException } from '../../types';
import { useAuth } from '../../hooks/UseAuth';
import { useNotificationContext } from '../../context/NotificationContext';
// import { Sender } from 'xstate';

const GAME_COMMAND = 'gameCommand';
const UPDATE_GAME = 'updateGame';
const JOIN_GAME = 'joinGame';
const LEAVE_GAME = 'leaveGame';

const Play = () => {
  const { warn } = useNotificationContext();
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState<number>(0);
  const [opponentScore, setOpponentScore] = React.useState<number>(0);
  const isPlayerOneRef = React.useRef(false);
  const isPlayerRef = React.useRef(false);
  const gameStateRef = React.useRef<GameState | null>(null);
  const gameId = StateMachineContext.useSelector(
    (state: any) => state.context.gameId,
  );
  const sendGameCommand = React.useCallback(
    (command: GameCommand) =>
      socket.emit(GAME_COMMAND, {
        command,
        gameRoomId: gameId,
      }),
    [gameId],
  );
  useGameControls(isPlayerRef.current ? sendGameCommand : undefined);
  const { authUser } = useAuth();

  React.useEffect(() => {
    function updateGame(info: GameInfo) {
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

    socket.on(UPDATE_GAME, updateGame);

    return () => {
      socket.off(UPDATE_GAME);
    };
  }, [authUser, renderMultiplayerFrame]);

  React.useEffect(() => {
    socket.emit(JOIN_GAME, { gameRoomId: gameId });

    return () => {
      socket.emit(LEAVE_GAME, { gameRoomId: gameId });
    };
  }, [gameId]);

  React.useEffect(() => {
    socket.on('exception', (wsError: WsException) => {
      warn(wsError.message);
    });

    return () => {
      socket.off('exception');
    };
  }, [warn]);

  if (!gameStateRef.current) {
    return <Wait />;
  }

  return (
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">{opponentScore}</h1>
      <canvas
        className="game-multiplayer-arena"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <h1 className="game-multiplayer-score heading-bold">{score}</h1>
    </div>
  );
};

// const Start = () => {
//   const actorRef = StateMachineContext.useActorRef();

//   return (
//     <div className="game-start">
//       <Button
//         variant={ButtonVariant.SUBMIT}
//         onClick={() => actorRef.send('READY')}
//       >
//         Ready?
//       </Button>
//     </div>
//   );
// };

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

// const StateMachine = () => {
//   const value = StateMachineContext.useSelector((state: any) => state.value);

//   const drawMachineState = (): JSX.Element => {
//     switch (value) {
//       case 'start':
//         return <Start />;
//       case 'wait':
//         return <Wait />;
//       case 'play':
//         return <Play />;
// case 'end':
//   return <End />;
//     default:
//       return <Start />;
//   }
// };

//   return <div className="game">{drawMachineState()}</div>;
// };

type GameProps = {
  gameId: string;
};

const Game = ({ gameId }: GameProps) => {
  const { goBack } = useNavigation();

  // const handshake = React.useCallback(
  //   () => (send: Sender<GameEvent>) => {
  //     const handshakeListener = (payload: { res: string }) => {
  //       console.log('Handshake listener called');
  //       console.log(payload);
  //       if (payload.res === 'ok') {
  //         send('READY');
  //       }
  //     };
  //     console.log('Handshake called');

  //     socket.on(JOIN_GAME, handshakeListener);

  //     return () => {
  //       socket.off(JOIN_GAME);
  //     };
  //   },
  //   [gameId],
  // );

  // return (
  //   <StateMachineContext.Provider
  //     machine={() =>
  //       gameMachine
  // .withConfig({
  //   services: {
  //     handshake: () => (send: Sender<GameEvent>) => {
  //       const handshakeListener = (payload: { res: string }) => {
  //         console.log('Handshake listener called');
  //         console.log(payload);
  //         if (payload.res === 'ok') {
  //           send('READY');
  //         }
  //       };
  //       console.log('Handshake called');

  //       socket.on(JOIN_GAME, handshakeListener);

  //       return () => {
  //         socket.off(JOIN_GAME);
  //       };
  //     },
  //   },
  // })
  //       .withContext({ gameId })
  //   }
  // >
  // {/* TODO , this is a temporal fix, replace with a menu */}
  // <Header
  //   icon={IconVariant.ARROW_BACK}
  //   onClick={() => {
  //     goBack();
  //   }}
  // >
  //   Hit the brick!
  // </Header>
  //   <StateMachine />
  // </StateMachineContext.Provider>
  // );
  return (
    <>
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={() => {
          goBack();
        }}
      >
        Hit the brick!
      </Header>
      <div className="game">
        <Play />
      </div>
    </>
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
