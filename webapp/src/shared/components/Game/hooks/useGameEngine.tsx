import * as React from 'react';

import {
  GameState,
  runGameFrame as runEngineGameFrame,
  runGameMultiplayerFrame as runEngineGameMultiplayerFrame,
} from 'pong-engine';
import { useGameStateContext } from '../context/gameStateContext';
import useGameAnimation from './useGameAnimation';
import { GameInfo } from '../../../types';
import { useAuth } from '../../../hooks/UseAuth';

type Callback = (game: GameInfo) => void;

const useGameEngine = (updateWithServer?: (cb: Callback) => void) => {
  const { gameStateRef } = useGameStateContext();
  const { deltaTimeRef } = useGameAnimation();
  const { authUser } = useAuth();
  const isPlayerOneRef = React.useRef(false);

  const runGameFrame = React.useCallback((): GameState => {
    const state = gameStateRef.current;
    const newState = runEngineGameFrame(deltaTimeRef.current, state);

    gameStateRef.current = newState;

    return gameStateRef.current;
  }, [gameStateRef, deltaTimeRef]);

  const runGameMultiplayerFrame = React.useCallback((): GameState => {
    if (updateWithServer) {
      updateWithServer((info: GameInfo) => {
        gameStateRef.current = info.state;
        isPlayerOneRef.current = info.playerOneId === authUser?.id;
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
  }, [gameStateRef, updateWithServer, deltaTimeRef, isPlayerOneRef, authUser]);

  return {
    runGameFrame,
    runGameMultiplayerFrame,
    isPlayerOneRef,
  };
};

export default useGameEngine;
