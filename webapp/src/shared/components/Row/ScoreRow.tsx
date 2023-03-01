import './Row.css';
import { TextColor, TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';
import { MediumAvatar } from '../Avatar/Avatar';
import { Link } from 'react-router-dom';
import React from 'react';
import { ScoreProps } from '../Score/Score';

type ScoreRowProps = {
  scoreProps: ScoreProps;
  url?: string;
};

export default function ScoreRow({ scoreProps, url }: ScoreRowProps) {
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
            {`${scoreProps.playerOneScore?.toString()} - ${scoreProps.playerTwoScore?.toString()} `}
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
          <Text
            variant={TextVariant.HEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {scoreProps.playerOneUserName}
          </Text>
        </div>
      </div>
      {scoreProps.playerOneAvatar && (
        <div className="row-avatar-right">
          <MediumAvatar {...scoreProps.playerOneAvatar} />
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
