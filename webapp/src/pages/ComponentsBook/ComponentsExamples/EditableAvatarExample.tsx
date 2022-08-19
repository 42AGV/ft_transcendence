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
  const xCoord = 20.14;
  const yCoord = 16.3;

  return (
    <BookSection title="Editable Avatar component">
      <EditableAvatar url={randomAvatar} />
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
