import { SmallAvatar, LargeAvatar } from '../../../shared/components';
import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';

// const randomAvatar = WILDCARD_AVATAR_URL;
const randomAvatar = 'http://localhost/icons/grid.jpg';

export const AvatarExample = () => (
  <BookSection title="Avatar component">
    <SmallAvatar url={randomAvatar} />
    <LargeAvatar url={randomAvatar} />
    <SmallAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <LargeAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <SmallAvatar url={randomAvatar} status="playing" />
    <LargeAvatar url={randomAvatar} edit status="playing" caption="level 21" />
  </BookSection>
);
