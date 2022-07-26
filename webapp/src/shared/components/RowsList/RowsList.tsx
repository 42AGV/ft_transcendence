import './RowsList.css';
import Row, { RowProps } from '../Row/Row';

type RowEntity = {
  rowDto: RowProps;
  key: string;
};

type RowsListProps = {
  rows?: RowEntity[];
};

export default function RowsList({ rows }: RowsListProps) {
  return (
    <ul className="rows-list">
      {rows &&
        rows.map((rowListProps) => (
          <li className="rows-list-item" key={rowListProps.key}>
            <Row {...rowListProps.rowDto} />
          </li>
        ))}
    </ul>
  );
}
