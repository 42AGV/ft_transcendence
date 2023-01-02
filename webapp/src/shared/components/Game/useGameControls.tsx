import * as React from 'react';

import { UseGameState } from './useGameState';

const useGameControls = () => {
  const dragRef = React.useRef<number>(0);
  const { dispatch } = UseGameState();

  const movePaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight') {
        dispatch({ type: 'paddleMoveRight', payload: {} });
      } else if (key === 'ArrowLeft') {
        dispatch({ type: 'paddleMoveLeft', payload: {} });
      }
    },
    [dispatch],
  );

  // const getPaddleDragX = (
  //   paddle: GamePaddle,
  //   dragPrevPos: number,
  //   dragCurrPos: number,
  // ): number => {
  //   const deltaX = paddle.x - (dragPrevPos - dragCurrPos);

  //   if (deltaX < 0) {
  //     return 0;
  //   } else if (deltaX > CANVAS_WIDTH - PADDLE_WIDTH) {
  //     return CANVAS_WIDTH - PADDLE_WIDTH;
  //   }
  //   return deltaX;
  // };

  // const dragPaddle = React.useCallback(
  //   (e: TouchEvent) => {
  //     const paddle = paddleRef.current;
  //     const dragCurrPos = e.touches[0].clientX;
  //     const dragPrevPos = dragRef.current;

  //     dragRef.current = dragCurrPos;

  //     if (dragPrevPos) {
  //       paddleRef.current = {
  //         ...paddle,
  //         x: getPaddleDragX(paddle, dragPrevPos, dragCurrPos),
  //       };
  //     }
  //   },
  //   [paddleRef],
  // );

  const resetDragPaddle = React.useCallback(() => {
    dragRef.current = 0;
  }, []);

  const stopPaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        dispatch({ type: 'paddleStop', payload: {} });
      }
    },
    [dispatch],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', movePaddle, false);
    window.addEventListener('keyup', stopPaddle, false);
    // window.addEventListener('touchmove', dragPaddle, false);
    window.addEventListener('touchend', resetDragPaddle, false);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      window.removeEventListener('keydown', movePaddle);
      window.removeEventListener('keyup', stopPaddle);
      // window.removeEventListener('touchmove', dragPaddle);
      window.removeEventListener('touchend', resetDragPaddle);
      window.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [movePaddle, stopPaddle, resetDragPaddle]);
};

export default useGameControls;
