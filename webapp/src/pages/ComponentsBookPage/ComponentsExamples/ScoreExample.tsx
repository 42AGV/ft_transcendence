import { Score } from '../../../shared/components';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { BookSection } from '../BookSection';

const randomAvatar = WILDCARD_AVATAR_URL;

const avProps = { url: randomAvatar };

export const ScoreExample = () => (
  <BookSection title="Chat Bubble component">
    <Score
      playerOneAvatar={avProps}
      playerTwoAvatar={avProps}
      playerOneUserName="pepito"
      playerTwoUserName="juanito"
      playerOneScore={10}
      playerTwoScore={30}
    />
  </BookSection>
);
