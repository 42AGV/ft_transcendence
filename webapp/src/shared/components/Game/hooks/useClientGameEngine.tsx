import * as React from 'react';

import { GameState, runGameFrame } from 'pong-engine';
import { useGameStateContext } from '../context';

const useClientGameEngine = () => {
  const { gameStateRef, dispatch } = useGameStateContext();

  const runClientGameFrame = React.useCallback(
    (deltaTime: number): GameState => {
      const state = gameStateRef.current;
      const action = runGameFrame(deltaTime, state);

      dispatch(action);
      return gameStateRef.current;
    },
    [dispatch, gameStateRef],
  );

  return { runClientGameFrame };
};

export default useClientGameEngine;
