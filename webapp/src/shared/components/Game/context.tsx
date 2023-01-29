import * as React from 'react';

import { GameState, newGame } from 'pong-engine';

type GameStateContextType = {
  gameStateRef: React.MutableRefObject<GameState>;
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

  return (
    <GameStateContext.Provider value={{ gameStateRef }}>
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
