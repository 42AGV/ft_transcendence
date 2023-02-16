import * as React from 'react';
import { useGameStateContext } from '../context/gameStateContext';
import {
  GameCommand,
  paddleMoveRight,
  paddleMoveLeft,
  paddleStop,
  paddleDrag,
  DragPayload,
} from 'pong-engine';

const useGameControls = (
  sendGameCommandToServer?: (
    command: GameCommand,
    payload?: DragPayload,
  ) => void,
) => {
  const { gameStateRef } = useGameStateContext();
  const dragRef = React.useRef<number>(0);

  const movePaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight') {
        gameStateRef.current = paddleMoveRight(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleMoveRight');
      } else if (key === 'ArrowLeft') {
        gameStateRef.current = paddleMoveLeft(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleMoveLeft');
      }
    },
    [sendGameCommandToServer, gameStateRef],
  );

  const dragPaddle = React.useCallback(
    (e: TouchEvent) => {
      const dragCurrPos = e.touches[0].clientX;
      const dragPrevPos = dragRef.current;
      dragRef.current = dragCurrPos;

      if (dragPrevPos) {
        gameStateRef.current = paddleDrag(
          gameStateRef.current,
          dragCurrPos,
          dragPrevPos,
        );
        sendGameCommandToServer &&
          sendGameCommandToServer('paddleDrag', { dragCurrPos, dragPrevPos });
      }
    },
    [sendGameCommandToServer, gameStateRef],
  );

  const resetDragPaddle = React.useCallback(() => {
    dragRef.current = 0;
  }, []);

  const stopPaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        gameStateRef.current = paddleStop(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleStop');
      }
    },
    [sendGameCommandToServer, gameStateRef],
  );

  const contextMenuHandler = React.useCallback(
    (e: MouseEvent) => e.preventDefault(),
    [],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', movePaddle, false);
    window.addEventListener('keyup', stopPaddle, false);
    window.addEventListener('touchmove', dragPaddle, false);
    window.addEventListener('touchend', resetDragPaddle, false);
    window.addEventListener('contextmenu', contextMenuHandler);
    return () => {
      window.removeEventListener('keydown', movePaddle);
      window.removeEventListener('keyup', stopPaddle);
      window.removeEventListener('touchmove', dragPaddle);
      window.removeEventListener('touchend', resetDragPaddle);
      window.removeEventListener('contextmenu', contextMenuHandler);
    };
  }, [movePaddle, stopPaddle, resetDragPaddle, dragPaddle, contextMenuHandler]);
};

export default useGameControls;
