import './Row.css';
import { Link } from 'react-router-dom';
import Score, { ScoreProps } from '../Score/Score';
import React from 'react';

type ScoreRowProps = {
  scoreProps: ScoreProps;
  url?: string;
};
export default function ScoreRow({ scoreProps, url }: ScoreRowProps) {
  return url ? (
    <Link className="row" to={url}>
      <Score {...scoreProps} />
    </Link>
  ) : (
    <Score {...scoreProps} />
  );
}
