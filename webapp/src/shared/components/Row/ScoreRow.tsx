import './ScoreRow.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { MediumAvatar } from '../Avatar/Avatar';
import { Link } from 'react-router-dom';
import { ScoreProps } from '../Score/Score';

export type ScoreRowProps = {
  scoreProps: ScoreProps;
  url?: string;
  gameMode?: string;
  gameDuration?: number;
  date?: Date;
};

export default function ScoreRow({
  scoreProps,
  url,
  gameMode,
  gameDuration,
  date,
}: ScoreRowProps) {
  const cursorStyle = {
    cursor: 'pointer',
  };
  const RowChildren: JSX.Element = (
    <>
      {scoreProps.playerOneAvatar && (
        <div className="row-avatar-left">
          <MediumAvatar {...scoreProps.playerOneAvatar} />
        </div>
      )}
      <div className="scorerow_text_wrapper">
        <div className="scorerow_text_upper_wrapper">
          <Text
            variant={TextVariant.HEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {scoreProps.playerOneUserName}
          </Text>
          <Text
            variant={TextVariant.HEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {scoreProps.playerOneScore === undefined ||
            scoreProps.playerTwoScore === undefined
              ? ' - '
              : `${scoreProps.playerOneScore!.toString()} - ${scoreProps.playerTwoScore!.toString()} `}
          </Text>
          <Text
            variant={TextVariant.HEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {scoreProps.playerTwoUserName}
          </Text>
        </div>
        <div className="scorerow_text_lower_wrapper">
          {gameMode && (
            <Text
              variant={TextVariant.PARAGRAPH}
              color={TextColor.LIGHT}
              weight={TextWeight.REGULAR}
            >
              {`Mode: ${gameMode} `}
            </Text>
          )}
          {gameDuration && (
            <Text
              variant={TextVariant.PARAGRAPH}
              color={TextColor.LIGHT}
              weight={TextWeight.REGULAR}
            >
              {`Duration: ${gameDuration}sec. `}
            </Text>
          )}
          {date && (
            <Text
              variant={TextVariant.PARAGRAPH}
              color={TextColor.LIGHT}
              weight={TextWeight.REGULAR}
            >
              {`Date: ${date.toLocaleString('en-GB')}`}
            </Text>
          )}
        </div>
      </div>
      {scoreProps.playerTwoAvatar && (
        <div className="row-avatar-right">
          <MediumAvatar {...scoreProps.playerTwoAvatar} />
        </div>
      )}
    </>
  );
  return url ? (
    <Link className="scorerow" to={url} style={cursorStyle}>
      {RowChildren}
    </Link>
  ) : (
    <div className="scorerow">{RowChildren}</div>
  );
}
