import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import {
  LargeAvatar,
  SmallAvatar,
  EditableAvatar,
} from '../../../shared/components';

const randomAvatar = WILDCARD_AVATAR_URL;

export const EditableAvatarExample = () => {
  const xCoord = 20.14;
  const yCoord = 16.3;

  return (
    <BookSection title="Editable Avatar component">
      <EditableAvatar picturePosition={{ x: 0, y: 0 }} url={randomAvatar} />
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
