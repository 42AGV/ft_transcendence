import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { EditableAvatar } from '../../../shared/components/Avatar/EditableAvatar';

const randomAvatar = WILDCARD_AVATAR_URL;

export const EditableAvatarExample = () => (
  <BookSection title="Editable Avatar component">
    <EditableAvatar url={randomAvatar} XCoordinate={10} YCoordinate={100} />
  </BookSection>
);
