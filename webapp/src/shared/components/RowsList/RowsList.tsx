import './RowsList.css';
import Row, { RowProps } from '../Row/Row';

export type RowItem = RowProps & {
  key: string;
};

type RowsListProps = {
  rows?: RowItem[];
  lastRowRef?: (row: HTMLLIElement) => void;
};

export default function RowsList({ rows, lastRowRef }: RowsListProps) {
  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowItem, index) => {
          const { key, ...rowProps } = rowItem;
          return (
            <li
              ref={rows.length === index + 1 ? lastRowRef : undefined}
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
