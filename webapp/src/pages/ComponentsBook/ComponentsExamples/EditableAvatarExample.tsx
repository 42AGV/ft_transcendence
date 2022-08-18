import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { EditableAvatar } from '../../../shared/components/Avatar/EditableAvatar';

const randomAvatar = WILDCARD_AVATAR_URL;
// const randomAvatar = 'http://localhost/icons/9000.jpeg';
const randomAvatar2 = 'http://localhost/icons/grid.jpg';

export const EditableAvatarExample = () => (
  <BookSection title="Editable Avatar component">
    <EditableAvatar url={randomAvatar} XCoordinate={13} YCoordinate={50} />
  </BookSection>
);
