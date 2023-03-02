import { ScoreRow } from '../../../shared/components';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { BookSection } from '../BookSection';

const randomAvatar = WILDCARD_AVATAR_URL;
const avProps = { url: randomAvatar };
const scoreProps = {
  playerOneAvatar: avProps,
  playerTwoAvatar: avProps,
  playerOneUserName: 'pepito',
  playerTwoUserName: 'juanito',
  playerOneScore: 10,
  playerTwoScore: 30,
};
export const ScoreRowExample = () => (
  <BookSection title="ScoreRow component">
    <ScoreRow
      scoreProps={scoreProps}
      url="/"
      gameMode="Classic"
      gameDuration={30}
      date={new Date(Date.now())}
    />
  </BookSection>
);
