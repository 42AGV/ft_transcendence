import * as React from 'react';
import { useIsElementVisible } from '../../hooks/UseIsElementVisible';

import Row, { RowProps } from '../Row/Row';

import './RowsList.css';

export type RowItem = RowProps & {
  key: string;
  altText?: string;
};

type RowsListProps = {
  rows?: RowItem[];
  onLastRowVisible?: () => void;
};

export default function RowsList({ rows, onLastRowVisible }: RowsListProps) {
  const { ref, isVisible } = useIsElementVisible();

  React.useEffect(() => {
    if (isVisible) {
      onLastRowVisible?.();
    }
  }, [isVisible, onLastRowVisible]);

  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowItem, index) => {
          const { key, altText, ...rowProps } = rowItem;
          return (
            <li
              ref={rows.length === index + 1 ? ref : undefined}
              className="rows-list-item"
              key={key}
              title={altText}
            >
              <Row {...rowProps} />
            </li>
          );
        })}
    </ul>
  );
}
