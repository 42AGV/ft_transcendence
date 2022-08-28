import React, { useEffect, useState } from 'react';
import { Position } from '../types';
import { EDITABLE_AVATAR_SCALE } from '../../pages/EditAvatarPage/EditAvatarPage';

type DragInfo = {
  isInitializing: boolean;
  isDragging: boolean;
  origin: Position;
  translation: Position | null;
  lastTranslation: Position | null;
};

export const useDrag = (startingPosition: Position | null) => {
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isInitializing: true,
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: startingPosition,
    lastTranslation: startingPosition,
  });

  const { isInitializing, isDragging } = dragInfo;
  useEffect(() => {
    if (startingPosition && isInitializing) {
      const scaledStartingPosition = {
        x: -startingPosition.x * EDITABLE_AVATAR_SCALE,
        y: -startingPosition.y * EDITABLE_AVATAR_SCALE,
      };
      setDragInfo({
        ...dragInfo,
        isInitializing: false,
        translation: scaledStartingPosition,
        lastTranslation: scaledStartingPosition,
      });
    }
  }, [startingPosition, isInitializing]);

  const handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    if (!isDragging && !isInitializing)
      setDragInfo({
        ...dragInfo,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      });
  };

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (isDragging && !isInitializing) {
      const { origin, lastTranslation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        translation: {
          x: origin.x + lastTranslation!.x - clientX,
          y: origin.y + lastTranslation!.y - clientY,
        },
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && !isInitializing) {
      const { translation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        isDragging: false,
        lastTranslation: { x: translation!.x, y: translation!.y },
      });
    }
  };

  const picturePosition: Position = {
    x: !isInitializing ? -dragInfo.translation!.x : 0,
    y: !isInitializing ? -dragInfo.translation!.y : 0,
  };

  return {
    picturePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
