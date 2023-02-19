import * as React from 'react';

import { GamePaddle, GameState, newGame } from 'pong-engine';

type GameStateFrame = {
  state: GameState;
  timestamp: EpochTimeStamp;
};

type PaddlesState = {
  paddle: GamePaddle;
  paddleOpponent: GamePaddle;
};

type GameStateContextType = {
  gameStateRef: React.MutableRefObject<GameState>;
  paddlesStateRef: React.MutableRefObject<PaddlesState>;
  serverFrameBufferRef: React.MutableRefObject<GameStateFrame[]>;
};

type GameStateContextProps = {
  children: React.ReactNode;
};

const GameStateContext = React.createContext<GameStateContextType | undefined>(
  undefined,
);

export const GameStateContextProvider = ({
  children,
}: GameStateContextProps) => {
  const gameStateRef = React.useRef<GameState>(newGame());
  const paddlesStateRef = React.useRef<PaddlesState>({
    paddle: gameStateRef.current.paddle,
    paddleOpponent: gameStateRef.current.paddleOpponent,
  });
  const serverFrameBufferRef = React.useRef<GameStateFrame[]>([]);

  return (
    <GameStateContext.Provider
      value={{ gameStateRef, serverFrameBufferRef, paddlesStateRef }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export function useGameStateContext() {
  const context = React.useContext(GameStateContext);
  if (context === undefined) {
    throw new Error(
      'useGameStateContext must be within GameStateContextProvider',
    );
  }
  return context;
}
