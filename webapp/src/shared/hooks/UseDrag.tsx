import React, { useState } from 'react';
import { Position } from '../types';

type DragInfo = {
  isDragging: boolean;
  origin: Position;
  translation: Position;
  lastTranslation: Position;
};

const useDrag = (startingPosition: Position) => {
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: startingPosition,
    lastTranslation: startingPosition,
  });

  const { isDragging } = dragInfo;
  const handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    if (!isDragging)
      setDragInfo({
        ...dragInfo,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      });
  };

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (isDragging) {
      const { origin, lastTranslation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        translation: {
          x: origin.x + lastTranslation.x - clientX,
          y: origin.y + lastTranslation.y - clientY,
        },
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const { translation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        isDragging: false,
        lastTranslation: { x: translation.x, y: translation.y },
      });
    }
  };

  const picturePosition = {
    x: -dragInfo.translation.x,
    y: -dragInfo.translation.y,
  };

  return {
    picturePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useDrag;
