import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { EditableAvatar } from '../../../shared/components/Avatar/EditableAvatar';
import { LargeAvatar, SmallAvatar } from '../../../shared/components';
import { useState } from 'react';
import useDrag from '../../../shared/hooks/UseDrag';

const randomAvatar = WILDCARD_AVATAR_URL;
//const randomAvatar = 'http://localhost/icons/9000.jpeg';
//const randomAvatar = 'http://localhost/icons/grid.jpg';

export type Position = {
  x: number;
  y: number;
};

export const EditableAvatarExample = () => {
  const startingPosition = { x: 0, y: 0 };
  const xCoord = 0;
  const yCoord = 0;

  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag(startingPosition);
  const factor = 0.3;

  return (
    <BookSection title="Editable Avatar component">
      <EditableAvatar
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        url={randomAvatar}
        XCoordinate={picturePosition.x * factor - 80}
        YCoordinate={picturePosition.y * factor - 80}
      />
      <LargeAvatar
        url={randomAvatar}
        XCoordinate={xCoord}
        YCoordinate={yCoord}
      />
      <SmallAvatar
        url={randomAvatar}
        XCoordinate={xCoord}
        YCoordinate={yCoord}
      />
    </BookSection>
  );
};
