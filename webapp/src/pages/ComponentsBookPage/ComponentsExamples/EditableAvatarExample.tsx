import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import {
  LargeAvatar,
  EditableAvatar,
  MediumAvatar,
} from '../../../shared/components';

const randomAvatar = WILDCARD_AVATAR_URL;

export const EditableAvatarExample = () => {
  const xCoord = 20.14;
  const yCoord = 16.3;

  return (
    <BookSection title="Editable Avatar component">
      <EditableAvatar
        XCoordinate={xCoord}
        YCoordinate={yCoord}
        url={randomAvatar}
      />
      <LargeAvatar
        url={randomAvatar}
        XCoordinate={xCoord}
        YCoordinate={yCoord}
      />
      <MediumAvatar
        url={randomAvatar}
        XCoordinate={xCoord}
        YCoordinate={yCoord}
      />
    </BookSection>
  );
};
