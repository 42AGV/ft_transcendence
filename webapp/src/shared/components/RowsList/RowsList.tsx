import './RowsList.css';
import Row, { RowProps } from '../Row/Row';

export type RowsListProps = {
  rows?: RowProps[];
};

export default function RowsList({ rows }: RowsListProps) {
  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowProps) => (
          <li className="rows-list-item" key={rowProps.key}>
            <Row {...rowProps} />
          </li>
        ))}
    </ul>
  );
}
