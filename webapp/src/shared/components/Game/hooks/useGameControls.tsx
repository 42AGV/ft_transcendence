import * as React from 'react';
import { useGameStateContext } from '../context';
import { GameCommand } from '../models';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const useGameControls = (
  sendGameCommand?: (
    command: GameCommand,
  ) => Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  const { dispatch } = useGameStateContext();
  const dragRef = React.useRef<number>(0);

  const movePaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight') {
        dispatch({ type: 'paddleMoveRight', payload: {} });
        sendGameCommand && sendGameCommand('paddleMoveRight');
      } else if (key === 'ArrowLeft') {
        dispatch({ type: 'paddleMoveLeft', payload: {} });
        sendGameCommand && sendGameCommand('paddleMoveLeft');
      }
    },
    [dispatch, sendGameCommand],
  );

  const dragPaddle = React.useCallback(
    (e: TouchEvent) => {
      const dragCurrPos = e.touches[0].clientX;
      const dragPrevPos = dragRef.current;
      dragRef.current = dragCurrPos;

      if (dragPrevPos) {
        dispatch({ type: 'paddleDrag', payload: { dragCurrPos, dragPrevPos } });
        sendGameCommand && sendGameCommand('paddleDrag');
      }
    },
    [dispatch, sendGameCommand],
  );

  const resetDragPaddle = React.useCallback(() => {
    dragRef.current = 0;
  }, []);

  const stopPaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        dispatch({ type: 'paddleStop', payload: {} });
        sendGameCommand && sendGameCommand('paddleStop');
      }
    },
    [dispatch, sendGameCommand],
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
  }, [movePaddle, stopPaddle, resetDragPaddle, dragPaddle]);
};

export default useGameControls;
