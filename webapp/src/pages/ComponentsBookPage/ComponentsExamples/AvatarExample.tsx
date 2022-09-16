import {
  MediumAvatar,
  LargeAvatar,
  SmallAvatar,
} from '../../../shared/components';
import { BookSection } from '../BookSection';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';

const randomAvatar = WILDCARD_AVATAR_URL;

export const AvatarExample = () => (
  <BookSection title="Avatar component">
    <SmallAvatar url={randomAvatar} />
    <MediumAvatar url={randomAvatar} />
    <LargeAvatar url={randomAvatar} />
    <SmallAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <MediumAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <LargeAvatar url={randomAvatar} XCoordinate={10} YCoordinate={5} />
    <SmallAvatar url={randomAvatar} status="playing" />
    <MediumAvatar url={randomAvatar} status="playing" />
    <LargeAvatar
      url={randomAvatar}
      editUrl={'/'}
      status="playing"
      caption="level 21"
    />
  </BookSection>
);
