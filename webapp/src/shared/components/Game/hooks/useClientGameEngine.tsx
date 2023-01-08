import * as React from 'react';

import {
  BALL_RADIUS,
  BRICK_WIDTH,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../constants';
import { GameBall, GameState } from '../models';
import { useGameStateContext } from '../context';

const useClientGameEngine = () => {
  const { gameStateRef, dispatch } = useGameStateContext();

  const isLose = React.useCallback(
    (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT,
    [],
  );

  const isWin = React.useCallback(
    (ball: GameBall) =>
      ball.y <= BALL_RADIUS &&
      ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
      ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2,
    [],
  );

  const runGameFrame = React.useCallback(
    (deltaTime: number): GameState => {
      const ball = gameStateRef.current.ball;

      if (isLose(ball)) {
        dispatch({ type: 'lose', payload: {} });
      } else {
        if (isWin(ball)) {
          dispatch({ type: 'win', payload: {} });
        }
        dispatch({ type: 'move', payload: { deltaTime } });
      }
      return gameStateRef.current;
    },
    [dispatch, isLose, isWin, gameStateRef],
  );

  return { runGameFrame };
};

export default useClientGameEngine;
