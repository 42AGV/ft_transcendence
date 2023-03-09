import './ScoreRow.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { MediumAvatar, SmallAvatar } from '../Avatar/Avatar';
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
          <div className="row-avatar-left-medium">
            <MediumAvatar {...scoreProps.playerOneAvatar} />
          </div>
          <div className="row-avatar-left-small">
            <SmallAvatar {...scoreProps.playerOneAvatar} />
          </div>
        </div>
      )}
      <div className="scorerow_text_wrapper">
        <div className="scorerow_text_upper_wrapper">
          <div className="scorerow_text_upper_wrapper_p1">
            <Text
              variant={TextVariant.SUBHEADING}
              color={TextColor.LIGHT}
              weight={TextWeight.REGULAR}
            >
              {scoreProps.playerOneUserName}
            </Text>
          </div>
          <div className="scorerow_text_upper_wrapper_score">
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
          </div>
          <div className="scorerow_text_upper_wrapper_p2">
            <Text
              variant={TextVariant.SUBHEADING}
              color={TextColor.LIGHT}
              weight={TextWeight.REGULAR}
            >
              {scoreProps.playerTwoUserName}
            </Text>
          </div>
        </div>
        <div className="scorerow_text_lower_wrapper">
          <div className="scorerow_text_lower_wrapper_mode">
            {gameMode && (
              <Text
                variant={TextVariant.PARAGRAPH}
                color={TextColor.LIGHT}
                weight={TextWeight.REGULAR}
              >
                {`Mode: ${gameMode} `}
              </Text>
            )}
          </div>
          <div className="scorerow_text_lower_wrapper_duration">
            {gameDuration && (
              <Text
                variant={TextVariant.PARAGRAPH}
                color={TextColor.LIGHT}
                weight={TextWeight.REGULAR}
              >
                {`Duration: ${gameDuration}sec. `}
              </Text>
            )}
          </div>
          <div className="scorerow_text_lower_wrapper_date">
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
      </div>
      {scoreProps.playerTwoAvatar && (
        <div className="row-avatar-right">
          <div className="row-avatar-right-medium">
            <MediumAvatar {...scoreProps.playerTwoAvatar} />
          </div>
          <div className="row-avatar-right-small">
            <SmallAvatar {...scoreProps.playerTwoAvatar} />
          </div>
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
