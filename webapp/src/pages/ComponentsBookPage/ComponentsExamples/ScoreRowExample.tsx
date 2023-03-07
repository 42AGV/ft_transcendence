import { ScoreRow } from '../../../shared/components';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { BookSection, BookSubsection } from '../BookSection';

const randomAvatar = WILDCARD_AVATAR_URL;
const randomAvatar2 = 'https://i.pravatar.cc/2000';
const avProps = { url: randomAvatar };
const avProps2 = { url: randomAvatar2 };
const scoreProps = {
  playerOneAvatar: avProps,
  playerTwoAvatar: avProps2,
  playerOneUserName: 'pepito',
  playerTwoUserName: 'juanito',
  playerOneScore: 10,
  playerTwoScore: 30,
};
export const ScoreRowExample = () => (
  <BookSection title="ScoreRow component" displayVertical>
    <BookSubsection title="All props">
      <ScoreRow
        scoreProps={scoreProps}
        url="/"
        gameMode="Classic"
        gameDuration={30}
        date={new Date(Date.now())}
      />
    </BookSubsection>
    <BookSubsection title="No score">
      <ScoreRow
        scoreProps={{
          playerOneAvatar: avProps,
          playerTwoAvatar: avProps2,
          playerOneUserName: 'pepito',
          playerTwoUserName: 'juanito',
        }}
      />
    </BookSubsection>
  </BookSection>
);
