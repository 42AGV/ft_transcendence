import * as React from 'react';

import {
  GameState,
  Action,
  initialBallState,
  initialPaddleState,
  reducer,
} from '@transcendence/pong-engine/state';

type GameStateContextType = {
  gameStateRef: React.MutableRefObject<GameState>;
  dispatch: (action: Action) => void;
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
  const gameStateRef = React.useRef<GameState>({
    ball: initialBallState(),
    paddle: initialPaddleState(),
    score: 0,
  });

  const dispatch = React.useCallback((action: Action) => {
    gameStateRef.current = reducer(gameStateRef.current, action);
  }, []);

  return (
    <GameStateContext.Provider value={{ gameStateRef, dispatch }}>
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
