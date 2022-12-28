import * as React from 'react';

import { GamePaddle } from './types';
import { CANVAS_WIDTH, PADDLE_SLIDE_SPEED, PADDLE_WIDTH } from './constants';

const useGameControls = (paddleRef: React.MutableRefObject<GamePaddle>) => {
  const dragRef = React.useRef<number>(0);

  const movePaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      const paddle = paddleRef.current;

      if (key === 'ArrowRight') {
        paddleRef.current = {
          ...paddle,
          slide: PADDLE_SLIDE_SPEED,
        };
      } else if (key === 'ArrowLeft') {
        paddleRef.current = {
          ...paddle,
          slide: -1 * PADDLE_SLIDE_SPEED,
        };
      }
    },
    [paddleRef],
  );

  const getPaddleDragX = (
    paddle: GamePaddle,
    dragPrevPos: number,
    dragCurrPos: number,
  ): number => {
    const deltaX = paddle.x - (dragPrevPos - dragCurrPos);

    if (deltaX < 0) {
      return 0;
    } else if (deltaX > CANVAS_WIDTH - PADDLE_WIDTH) {
      return CANVAS_WIDTH - PADDLE_WIDTH;
    }
    return deltaX;
  };

  const dragPaddle = React.useCallback(
    (e: TouchEvent) => {
      const paddle = paddleRef.current;
      const dragCurrPos = e.touches[0].clientX;
      const dragPrevPos = dragRef.current;

      dragRef.current = dragCurrPos;

      if (dragPrevPos) {
        paddleRef.current = {
          ...paddle,
          x: getPaddleDragX(paddle, dragPrevPos, dragCurrPos),
        };
      }
    },
    [paddleRef],
  );

  const resetDragPaddle = React.useCallback((e: TouchEvent) => {
    dragRef.current = 0;
  }, []);

  const stopPaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      const paddle = paddleRef.current;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        paddleRef.current = {
          ...paddle,
          slide: 0,
        };
      }
    },
    [paddleRef],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', movePaddle, false);
    window.addEventListener('keyup', stopPaddle, false);
    window.addEventListener('touchmove', dragPaddle, false);
    window.addEventListener('touchend', resetDragPaddle, false);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      window.removeEventListener('keydown', movePaddle);
      window.removeEventListener('keyup', stopPaddle);
      window.removeEventListener('touchmove', dragPaddle);
      window.removeEventListener('touchend', resetDragPaddle);
      window.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [movePaddle, stopPaddle, dragPaddle, resetDragPaddle]);

  return { movePaddle, dragPaddle, stopPaddle };
};

export default useGameControls;
