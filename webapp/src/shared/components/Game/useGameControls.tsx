import * as React from 'react';
import { GamePaddle } from './types';
import { PADDLE_SLIDE_SPEED } from './constants';

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

  const dragPaddle = React.useCallback(
    (e: TouchEvent) => {
      const paddle = paddleRef.current;
      const dragPos = dragRef.current;
      dragRef.current = e.touches[0].clientX;

      if (dragPos)
        paddleRef.current = {
          ...paddle,
          x: paddle.x - (dragPos - dragRef.current),
        };
    },
    [paddleRef],
  );

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
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      window.removeEventListener('keydown', movePaddle);
      window.removeEventListener('keyup', stopPaddle);
      window.removeEventListener('touchmove', dragPaddle);
      window.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [movePaddle, stopPaddle, dragPaddle]);

  return { movePaddle, dragPaddle, stopPaddle };
};

export default useGameControls;
