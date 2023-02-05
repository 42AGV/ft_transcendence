import { AvatarProps, MediumAvatar } from '../Avatar/Avatar';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './Score.css';

type ScoreProps = {
  playerOneAvatar: AvatarProps;
  playerTwoAvatar: AvatarProps;
  playerOneUserName: string;
  playerTwoUserName: string;
  playerOneScore: number;
  playerTwoScore: number;
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
      <div className="player-one-avatar-name">
        <MediumAvatar {...playerOneAvatar} />
        <Text
          variant={TextVariant.PARAGRAPH}
          color={TextColor.LIGHT}
          weight={TextWeight.MEDIUM}
          children={playerOneUserName}
        />
      </div>
      <div className="score">
        <Text
          variant={TextVariant.SUBTITLE}
          color={TextColor.LIGHT}
          weight={TextWeight.MEDIUM}
          children={`${playerOneScore} - ${playerTwoScore}`}
        />
      </div>
      <div className="player-two-avatar">
        <MediumAvatar {...playerTwoAvatar} />
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
