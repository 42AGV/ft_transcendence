import * as React from 'react';
import { UseIsElementVisible } from '../../hooks/UseIsElementVisible';

import Row, { RowProps } from '../Row/Row';

import './RowsList.css';

export type RowItem = RowProps & {
  key: string;
};

type RowsListProps = {
  rows?: RowItem[];
  onLastRowVisible?: () => void;
};

export default function RowsList({ rows, onLastRowVisible }: RowsListProps) {
  const { ref, isVisible } = UseIsElementVisible();

  React.useEffect(() => {
    if (isVisible) {
      onLastRowVisible?.();
    }
  }, [isVisible, onLastRowVisible]);

  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowItem, index) => {
          const { key, ...rowProps } = rowItem;
          return (
            <li
              ref={rows.length === index + 1 ? ref : undefined}
              className="rows-list-item"
              key={key}
            >
              <Row {...rowProps} />
            </li>
          );
        })}
    </ul>
  );
}
