import React, { useState } from 'react';
import { Position } from '../../pages/ComponentsBook/ComponentsExamples/EditableAvatarExample';

const useDrag = (startingPosition: Position) => {
  const [dragInfo, setDragInfo] = useState({
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
        origin: { x: clientX ?? 0, y: clientY ?? 0 },
      });
  };

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (isDragging) {
      const { origin, lastTranslation } = dragInfo;
      setDragInfo({
        ...dragInfo,
        translation: {
          x: Math.abs(clientX ?? 0 - (origin.x + lastTranslation.x)),
          y: Math.abs(clientY ?? 0 - (origin.y + lastTranslation.y)),
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
    x: dragInfo.translation.x,
    y: dragInfo.translation.y,
  };

  return {
    picturePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useDrag;
