import { AvatarProps, MediumAvatar } from '../Avatar/Avatar';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Score.css';

export type ScoreProps = {
  playerOneAvatar?: AvatarProps;
  playerTwoAvatar?: AvatarProps;
  playerOneUserName: string;
  playerTwoUserName: string;
  playerOneScore?: number;
  playerTwoScore?: number;
};

export default function Score({
  playerOneAvatar,
  playerTwoAvatar,
  playerOneUserName,
  playerTwoUserName,
  playerOneScore,
  playerTwoScore,
}: ScoreProps) {
  return (
    <div className="score-container">
      <div className="player-one">
        {playerOneAvatar && <MediumAvatar {...playerOneAvatar} />}
        <Text
          variant={TextVariant.PARAGRAPH}
          color={TextColor.LIGHT}
          weight={TextWeight.MEDIUM}
          children={playerOneUserName}
        />
      </div>
      <div className="score-p1">
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
          children={`${playerOneScore}`}
        />
      </div>
      <div className="score--">
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
          children={` - `}
        />
      </div>
      <div className="score-p2">
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.LIGHT}
          weight={TextWeight.BOLD}
          children={`${playerTwoScore}`}
        />
      </div>
      <div className="player-two">
        {playerTwoAvatar && <MediumAvatar {...playerTwoAvatar} />}
        <Text
          variant={TextVariant.PARAGRAPH}
          color={TextColor.LIGHT}
          weight={TextWeight.MEDIUM}
          children={playerTwoUserName}
        />
      </div>
    </div>
  );
}
