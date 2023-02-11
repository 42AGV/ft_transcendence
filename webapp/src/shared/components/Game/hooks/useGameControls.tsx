import * as React from 'react';
import { useGameStateContext } from '../context/gameStateContext';
import {
  GameCommand,
  paddleMoveRight,
  paddleMoveLeft,
  paddleStop,
  paddleDrag,
  paddleOpponentMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentStop,
  DragPayload,
  paddleOpponentDrag,
} from 'pong-engine';

const useGameControls = (
  sendGameCommandToServer?: (
    command: GameCommand,
    payload?: DragPayload,
  ) => void,
  isPlayerOne: boolean = true,
) => {
  const { gameStateRef } = useGameStateContext();
  const dragRef = React.useRef<number>(0);

  const movePaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight') {
        gameStateRef.current = isPlayerOne
          ? paddleMoveRight(gameStateRef.current)
          : paddleOpponentMoveRight(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleMoveRight');
      } else if (key === 'ArrowLeft') {
        gameStateRef.current = isPlayerOne
          ? paddleMoveLeft(gameStateRef.current)
          : paddleOpponentMoveLeft(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleMoveLeft');
      }
    },
    [sendGameCommandToServer, gameStateRef, isPlayerOne],
  );

  const dragPaddle = React.useCallback(
    (e: TouchEvent) => {
      const dragCurrPos = e.touches[0].clientX;
      const dragPrevPos = dragRef.current;
      dragRef.current = dragCurrPos;

      if (dragPrevPos) {
        gameStateRef.current = isPlayerOne
          ? paddleDrag(gameStateRef.current, dragCurrPos, dragPrevPos)
          : paddleOpponentDrag(gameStateRef.current, dragCurrPos, dragPrevPos);
        sendGameCommandToServer &&
          sendGameCommandToServer('paddleDrag', { dragCurrPos, dragPrevPos });
      }
    },
    [sendGameCommandToServer, gameStateRef, isPlayerOne],
  );

  const resetDragPaddle = React.useCallback(() => {
    dragRef.current = 0;
  }, []);

  const stopPaddle = React.useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        gameStateRef.current = isPlayerOne
          ? paddleStop(gameStateRef.current)
          : paddleOpponentStop(gameStateRef.current);
        sendGameCommandToServer && sendGameCommandToServer('paddleStop');
      }
    },
    [sendGameCommandToServer, gameStateRef, isPlayerOne],
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
