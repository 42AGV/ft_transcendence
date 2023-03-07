import * as React from 'react';
import { useIsElementVisible } from '../../hooks/UseIsElementVisible';

import ScoreRow, { ScoreRowProps } from '../Row/ScoreRow';

import './RowsList.css';
import { removeDuplicatesFromArray } from '../../utils/removeDuplicatesFromArray';

export type ScoreRowItem = ScoreRowProps & {
  key: string;
  altText?: string;
};

type ScoreRowsListProps = {
  rows?: ScoreRowItem[];
  onLastRowVisible?: () => void;
};

export default function ScoreRowsList({
  rows,
  onLastRowVisible,
}: ScoreRowsListProps) {
  const { ref, isVisible } = useIsElementVisible();

  React.useEffect(() => {
    if (isVisible) {
      onLastRowVisible?.();
    }
  }, [isVisible, onLastRowVisible]);

  return (
    <ul className="rows-list">
      {rows &&
        removeDuplicatesFromArray(rows, 'key').map((rowItem, index) => {
          const { key, altText, ...rowProps } = rowItem;
          return (
            <li
              ref={rows.length === index + 1 ? ref : undefined}
              className="rows-list-item"
              key={key}
              title={altText}
            >
              <ScoreRow {...rowProps} />
            </li>
          );
        })}
    </ul>
  );
}
