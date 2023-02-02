import * as React from 'react';

import {
  GameState,
  runGameFrame as runEngineGameFrame,
  runGameMultiplayerFrame as runEngineGameMultiplayerFrame,
} from 'pong-engine';
import { useGameStateContext } from '../context';
import useGameAnimation from './useGameAnimation';

type Callback = (game: GameState) => void;

const useGameEngine = (updateWithServer?: (cb: Callback) => void) => {
  const { gameStateRef } = useGameStateContext();
  const { deltaTimeRef } = useGameAnimation();

  const runGameFrame = React.useCallback((): GameState => {
    if (updateWithServer) {
      updateWithServer((state: GameState) => {
        gameStateRef.current = state;
      });
    } else {
      const state = gameStateRef.current;
      const newState = runEngineGameFrame(deltaTimeRef.current, state);

      gameStateRef.current = newState;
    }

    return gameStateRef.current;
  }, [gameStateRef, updateWithServer, deltaTimeRef]);

  const runGameMultiplayerFrame = React.useCallback((): GameState => {
    if (updateWithServer) {
      updateWithServer((state: GameState) => {
        gameStateRef.current = state;
      });
    } else {
      const state = gameStateRef.current;
      const newState = runEngineGameMultiplayerFrame(
        deltaTimeRef.current,
        state,
      );

      gameStateRef.current = newState;
    }

    return gameStateRef.current;
  }, [gameStateRef, updateWithServer, deltaTimeRef]);

  return { runGameFrame, runGameMultiplayerFrame };
};

export default useGameEngine;
