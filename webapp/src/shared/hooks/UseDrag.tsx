import React, { useEffect, useState } from 'react';
import { Position } from '../types';
import { EDITABLE_AVATAR_SCALE } from '../../pages/EditAvatar/EditAvatar';

type DragInfo = {
  isLoading: boolean;
  isDragging: boolean;
  origin: Position;
  translation: Position | null;
  lastTranslation: Position | null;
};

export const useDrag = (startingPosition: Position | null) => {
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
        x: -startingPosition.x * EDITABLE_AVATAR_SCALE,
        y: -startingPosition.y * EDITABLE_AVATAR_SCALE,
      };
      setDragInfo({
        ...dragInfo,
        isLoading: false,
        translation: scaledStartingPosition,
        lastTranslation: scaledStartingPosition,
      });
    }
  }, [startingPosition, dragInfo, isLoading]);

  const handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    if (!isDragging && !isLoading)
      setDragInfo({
        ...dragInfo,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      });
  };

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (isDragging && !isLoading) {
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
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
