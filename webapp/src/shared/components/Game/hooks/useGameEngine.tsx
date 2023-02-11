import * as React from 'react';

import {
  GameState,
  runGameFrame as runEngineGameFrame,
  runGameMultiplayerFrame as runEngineGameMultiplayerFrame,
} from 'pong-engine';
import { useGameStateContext } from '../context/gameStateContext';
import useGameAnimation from './useGameAnimation';

type GameStateFrame = {
  state: GameState;
  timestamp: EpochTimeStamp;
};

const ONE_SECOND_IN_MS = 1000;

const useGameEngine = () => {
  const { gameStateRef, serverFrameBufferRef } = useGameStateContext();
  const { deltaTimeRef } = useGameAnimation();
  const interpolatedFramesRef = React.useRef<GameState[]>([]);

  const getNumberOfInterpolatedFrames = React.useCallback(
    (serverFramesDeltaTime: number) => {
      const div =
        serverFramesDeltaTime / (deltaTimeRef.current * ONE_SECOND_IN_MS);
      const floor = Math.floor(div);
      const value = div - floor < 0.5 ? floor - 1 : floor;

      return value > 0 ? value : 0;
    },
    [deltaTimeRef],
  );

  const calculateInterpolatedFrames = React.useCallback(
    (finalFrame: GameStateFrame, initialFrame: GameStateFrame): GameState[] => {
      const frameDeltaTime = finalFrame.timestamp - initialFrame.timestamp;
      const interpolatedFrames: GameState[] = [initialFrame.state];

      if (deltaTimeRef.current === 0) {
        return interpolatedFrames;
      }

      let framesToInterpolate = getNumberOfInterpolatedFrames(frameDeltaTime);
      const interpolatedFrameDeltaTime =
        frameDeltaTime / (1 + framesToInterpolate) / ONE_SECOND_IN_MS;

      while (framesToInterpolate > 0) {
        const newState = runEngineGameMultiplayerFrame(
          interpolatedFrameDeltaTime,
          interpolatedFrames[interpolatedFrames.length - 1],
        );
        interpolatedFrames.push(newState);
        framesToInterpolate--;
      }

      return interpolatedFrames;
    },
    [deltaTimeRef, getNumberOfInterpolatedFrames],
  );

  const runInterpolationFrame = React.useCallback((): GameState => {
    const serverFrameBuffer = serverFrameBufferRef.current;

    if (serverFrameBuffer.length > 1) {
      interpolatedFramesRef.current.push(
        ...calculateInterpolatedFrames(
          serverFrameBuffer[1],
          serverFrameBuffer[0],
        ),
      );
      serverFrameBufferRef.current.shift();
    }

    return interpolatedFramesRef.current.shift() || gameStateRef.current;
  }, [
    serverFrameBufferRef,
    interpolatedFramesRef,
    calculateInterpolatedFrames,
    gameStateRef,
  ]);

  const runGameMultiplayerFrame = React.useCallback(
    (isPlayerOne: boolean): GameState => {
      const interpolatedFrame = runInterpolationFrame();
      const localPaddleFrame = runEngineGameMultiplayerFrame(
        deltaTimeRef.current,
        gameStateRef.current,
      );

      console.log('PADDLE', localPaddleFrame.paddle);
      gameStateRef.current = isPlayerOne
        ? {
            ...interpolatedFrame,
            paddle: localPaddleFrame.paddle,
          }
        : {
            ...interpolatedFrame,
            paddleOpponent: localPaddleFrame.paddleOpponent,
          };
      return gameStateRef.current;
    },
    [gameStateRef, runInterpolationFrame, deltaTimeRef],
  );

  const runGameFrame = React.useCallback((): GameState => {
    const state = gameStateRef.current;
    gameStateRef.current = runEngineGameFrame(deltaTimeRef.current, state);

    return gameStateRef.current;
  }, [gameStateRef, deltaTimeRef]);

  return {
    runGameFrame,
    runGameMultiplayerFrame,
  };
};

export default useGameEngine;

// TODO
// 0. Hacer movimiento flechas como drag
// 3. Gestionar timeout, conexión inestable
// 4. Evitar mover palas al empezar
