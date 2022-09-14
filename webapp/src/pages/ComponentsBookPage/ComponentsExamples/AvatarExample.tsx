import { SmallAvatar, LargeAvatar, XSAvatar } from '../../../shared/components';
import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';

const randomAvatar = WILDCARD_AVATAR_URL;

export const AvatarExample = () => (
  <BookSection title="Avatar component">
    <XSAvatar url={randomAvatar} />
    <SmallAvatar url={randomAvatar} />
    <LargeAvatar url={randomAvatar} />
    <XSAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <SmallAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <LargeAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <XSAvatar url={randomAvatar} status="playing" />
    <SmallAvatar url={randomAvatar} status="playing" />
    <LargeAvatar
      url={randomAvatar}
      editUrl={'/'}
      status="playing"
      caption="level 21"
    />
  </BookSection>
);
