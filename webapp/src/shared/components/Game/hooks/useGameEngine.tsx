import * as React from 'react';

import { GameState, runGameFrame as runEngineGameFrame } from 'pong-engine';
import { useGameStateContext } from '../context';
import useGameAnimation from './useGameAnimation';

type Callback = () => void;

const useGameEngine = (
  updateWithServer?: (cb: Callback) => void,
  serverInitGameHandshake?: (deltaTime: number) => void,
) => {
  const { gameStateRef, dispatch } = useGameStateContext();
  const { deltaTimeRef } = useGameAnimation();
  const updateGameState = React.useCallback(() => {}, []);

  const runGameFrame = React.useCallback((): GameState => {
    const state = gameStateRef.current;
    const action = runEngineGameFrame(deltaTimeRef.current, state);
    updateWithServer && updateWithServer(updateGameState);

    dispatch(action);
    return gameStateRef.current;
  }, [dispatch, gameStateRef, updateWithServer, updateGameState, deltaTimeRef]);

  return { runGameFrame };
};

export default useGameEngine;
