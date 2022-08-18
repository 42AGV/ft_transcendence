import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { EditableAvatar } from '../../../shared/components/Avatar/EditableAvatar';
import { LargeAvatar, SmallAvatar } from '../../../shared/components';

const randomAvatar = WILDCARD_AVATAR_URL;
//const randomAvatar = 'http://localhost/icons/9000.jpeg';
//const randomAvatar = 'http://localhost/icons/grid.jpg';

export const EditableAvatarExample = () => {
  const xCoord = 0;
  const yCoord = 0;
  return (
    <BookSection title="Editable Avatar component">
      <EditableAvatar
        url={randomAvatar}
        XCoordinate={xCoord}
        YCoordinate={yCoord}
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
