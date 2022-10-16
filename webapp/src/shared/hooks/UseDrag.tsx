import React, { useEffect, useState } from 'react';
import { Position } from '../types';

type DragInfo = {
  isLoading: boolean;
  isDragging: boolean;
  origin: Position;
  translation: Position | null;
  lastTranslation: Position | null;
};

type useDragProps = {
  startingPosition: Position | null;
  reverseTransform: (arg0: number) => number;
};

export const useDrag = ({
  startingPosition,
  reverseTransform,
}: useDragProps) => {
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isLoading: true,
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: startingPosition,
    lastTranslation: startingPosition,
  });

  const { isLoading, isDragging } = dragInfo;
  useEffect(() => {
    if (startingPosition && isLoading) {
      const scaledStartingPosition = {
        x: reverseTransform(startingPosition.x),
        y: reverseTransform(startingPosition.y),
      };
      setDragInfo({
        ...dragInfo,
        isLoading: false,
        translation: scaledStartingPosition,
        lastTranslation: scaledStartingPosition,
      });
    }
  }, [startingPosition, dragInfo, isLoading, reverseTransform]);

  const handleDown = (event: React.MouseEvent | React.TouchEvent) => {
    const e = event.nativeEvent;
    if (!isDragging && !isLoading) {
      if (e instanceof MouseEvent) {
        setDragInfo({
          ...dragInfo,
          isDragging: true,
          origin: { x: e.clientX, y: e.clientY },
        });
      } else if (e instanceof TouchEvent) {
        setDragInfo({
          ...dragInfo,
          isDragging: true,
          origin: { x: e.touches[0].clientX, y: e.touches[0].clientY },
        });
      }
    }
  };

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    const e = event.nativeEvent;
    if (isDragging && !isLoading) {
      const { origin, lastTranslation } = dragInfo;
      if (e instanceof MouseEvent) {
        setDragInfo({
          ...dragInfo,
          translation: {
            x: origin.x + lastTranslation!.x - e.clientX,
            y: origin.y + lastTranslation!.y - e.clientY,
          },
        });
      } else if (e instanceof TouchEvent) {
        setDragInfo({
          ...dragInfo,
          translation: {
            x: origin.x + lastTranslation!.x - e.touches[0].clientX,
            y: origin.y + lastTranslation!.y - e.touches[0].clientY,
          },
        });
      }
    }
  };

  const handleUp = () => {
    if (isDragging && !isLoading) {
      const { translation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        isDragging: false,
        lastTranslation: { x: translation!.x, y: translation!.y },
      });
    }
  };

  const picturePosition: Position = {
    x: !isLoading ? -dragInfo.translation!.x : 0,
    y: !isLoading ? -dragInfo.translation!.y : 0,
  };

  return {
    picturePosition,
    handleDown,
    handleMove,
    handleUp,
  };
};
