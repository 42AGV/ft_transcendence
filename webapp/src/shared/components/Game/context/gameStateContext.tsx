import * as React from 'react';

import { GameState, newGame } from 'pong-engine';

type GameStateFrame = {
  state: GameState;
  timestamp: EpochTimeStamp;
};

type GameStateContextType = {
  gameStateRef: React.MutableRefObject<GameState>;
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
  const serverFrameBufferRef = React.useRef<GameStateFrame[]>([]);

  return (
    <GameStateContext.Provider value={{ gameStateRef, serverFrameBufferRef }}>
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
