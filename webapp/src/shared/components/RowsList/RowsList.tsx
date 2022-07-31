import './RowsList.css';
import Row, { RowProps } from '../Row/Row';

export type RowItem = RowProps & {
  key: string;
};

type RowsListProps = {
  rows?: RowItem[];
};

export default function RowsList({ rows }: RowsListProps) {
  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowItem) => {
          const { key, ...rowProps } = rowItem;
          return (
            <li className="rows-list-item" key={key}>
              <Row {...rowProps} />
            </li>
          );
        })}
    </ul>
  );
}
