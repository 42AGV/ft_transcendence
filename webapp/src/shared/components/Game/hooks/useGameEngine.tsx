import * as React from 'react';

import {
  GameState,
  paddleMoveLeft,
  paddleMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentMoveRight,
  runGameFrame as runEngineGameFrame,
  runGameMultiplayerFrame as runEngineGameMultiplayerFrame,
} from 'pong-engine';
import { useGameStateContext } from '../context/gameStateContext';
import useGameAnimation from './useGameAnimation';

type GameStateFrame = {
  state: GameState;
  timestamp: EpochTimeStamp;
};

type PaddleMovement = 'right' | 'left';

const ONE_SECOND_IN_MS = 1000;

const useGameEngine = () => {
  const { gameStateRef, serverFrameBufferRef, paddlesStateRef } =
    useGameStateContext();
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

  const getInterpolateOpponentPaddleAction = React.useCallback(
    (
      isPlayerOne: boolean,
      finalFrame: GameStateFrame,
      initialFrame: GameStateFrame,
    ): PaddleMovement | null => {
      if (isPlayerOne) {
        const deltaX =
          finalFrame.state.paddleOpponent.x -
          initialFrame.state.paddleOpponent.x;
        if (deltaX !== 0) {
          return deltaX < 0 ? 'right' : 'left';
        }
      } else {
        const deltaX = finalFrame.state.paddle.x - initialFrame.state.paddle.x;
        if (deltaX !== 0) {
          return deltaX > 0 ? 'right' : 'left';
        }
      }
      return null;
    },
    [],
  );

  const interpolatePaddleOpponentState = React.useCallback(
    (
      isPlayerOne: boolean,
      state: GameState,
      interpolatedPaddleMovementAction: PaddleMovement,
    ): GameState => {
      if (isPlayerOne) {
        return interpolatedPaddleMovementAction === 'right'
          ? paddleOpponentMoveRight(state)
          : paddleOpponentMoveLeft(state);
      } else {
        return interpolatedPaddleMovementAction === 'right'
          ? paddleMoveRight(state)
          : paddleMoveLeft(state);
      }
    },
    [],
  );

  const calculateInterpolatedFrames = React.useCallback(
    (
      isPlayerOne: boolean,
      finalFrame: GameStateFrame,
      initialFrame: GameStateFrame,
    ): GameState[] => {
      const frameDeltaTime = finalFrame.timestamp - initialFrame.timestamp;
      const interpolatedFrames: GameState[] = [initialFrame.state];

      if (deltaTimeRef.current === 0) {
        return interpolatedFrames;
      }

      const interpolatedOpponentPaddleAction =
        getInterpolateOpponentPaddleAction(
          isPlayerOne,
          finalFrame,
          initialFrame,
        );
      let framesToInterpolate = getNumberOfInterpolatedFrames(frameDeltaTime);
      const interpolatedFrameDeltaTime =
        frameDeltaTime / (1 + framesToInterpolate) / ONE_SECOND_IN_MS;

      while (framesToInterpolate > 0) {
        const prevState = interpolatedOpponentPaddleAction
          ? interpolatePaddleOpponentState(
              isPlayerOne,
              interpolatedFrames[interpolatedFrames.length - 1],
              interpolatedOpponentPaddleAction,
            )
          : interpolatedFrames[interpolatedFrames.length - 1];
        const newState = runEngineGameMultiplayerFrame(
          interpolatedFrameDeltaTime,
          prevState,
        );
        interpolatedFrames.push(newState);
        framesToInterpolate--;
      }

      return interpolatedFrames;
    },
    [
      deltaTimeRef,
      getNumberOfInterpolatedFrames,
      getInterpolateOpponentPaddleAction,
      interpolatePaddleOpponentState,
    ],
  );

  const runInterpolationFrame = React.useCallback(
    (isPlayerOne: boolean): GameState => {
      const serverFrameBuffer = serverFrameBufferRef.current;

      if (serverFrameBuffer.length > 1) {
        interpolatedFramesRef.current.push(
          ...calculateInterpolatedFrames(
            isPlayerOne,
            serverFrameBuffer[1],
            serverFrameBuffer[0],
          ),
        );
        serverFrameBufferRef.current.shift();
      }

      return interpolatedFramesRef.current.shift() || gameStateRef.current;
    },
    [
      serverFrameBufferRef,
      interpolatedFramesRef,
      calculateInterpolatedFrames,
      gameStateRef,
    ],
  );

  const runGameMultiplayerFrame = React.useCallback(
    (isPlayerOne: boolean): GameState => {
      const interpolatedFrame = runInterpolationFrame(isPlayerOne);
      const localPaddleFrame = runEngineGameMultiplayerFrame(
        deltaTimeRef.current,
        gameStateRef.current,
      );

      paddlesStateRef.current = {
        paddle: localPaddleFrame.paddle,
        paddleOpponent: localPaddleFrame.paddleOpponent,
      };

      gameStateRef.current = isPlayerOne
        ? {
            ...interpolatedFrame,
            // paddle: localPaddleFrame.paddle,
          }
        : {
            ...interpolatedFrame,
            // paddleOpponent: localPaddleFrame.paddleOpponent,
          };

      return gameStateRef.current;
    },
    [gameStateRef, runInterpolationFrame, deltaTimeRef, paddlesStateRef],
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
// 0. Arreglar vibración pala (drag)
// 1 Gestionar colisiones con sevidor
// 2. Evitar mover palas al empezar
// 3. Gestionar timeout, conexión inestable
