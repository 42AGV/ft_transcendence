import * as React from 'react';

import {
  GameState,
  runGameFrame as runEngineGameFrame,
  runGameMultiplayerFrame as runEngineGameMultiplayerFrame,
} from 'pong-engine';
import { useGameStateContext } from '../context/gameStateContext';
import useGameAnimation from './useGameAnimation';

const useGameEngine = () => {
  const { gameStateRef } = useGameStateContext();
  const { deltaTimeRef } = useGameAnimation();

  const runGameFrame = React.useCallback((): GameState => {
    const state = gameStateRef.current;
    const newState = runEngineGameFrame(deltaTimeRef.current, state);

    gameStateRef.current = newState;

    return gameStateRef.current;
  }, [gameStateRef, deltaTimeRef]);

  const runGameMultiplayerFrame = React.useCallback((): GameState => {
    const state = gameStateRef.current;
    const newState = runEngineGameMultiplayerFrame(deltaTimeRef.current, state);

    gameStateRef.current = newState;

    return gameStateRef.current;
  }, [gameStateRef, deltaTimeRef]);

  return {
    runGameFrame,
    runGameMultiplayerFrame,
  };
};

export default useGameEngine;
