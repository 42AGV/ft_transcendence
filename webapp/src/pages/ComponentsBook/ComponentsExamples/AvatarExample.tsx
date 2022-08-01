import { SmallAvatar, LargeAvatar } from '../../../shared/components';
import { BookSection } from '../BookSection';

const randomAvatar = 'https://i.pravatar.cc/1000';

export const AvatarExample = () => (
  <BookSection title="Avatar component">
    <SmallAvatar url={randomAvatar} />
    <LargeAvatar url={randomAvatar} />
    <SmallAvatar url={randomAvatar} status="playing" />
    <LargeAvatar url={randomAvatar} edit status="playing" caption="level 21" />
  </BookSection>
);
