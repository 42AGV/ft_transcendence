import './RowsList.css';
import Row, { RowProps } from '../Row/Row';

export type RowsListProps = {
  rows?: RowProps[];
};

export default function RowsList({ rows }: RowsListProps) {
  return (
    <div className="rows-list-wrapper">
      {rows && rows.map((rowProps) => <Row {...rowProps} />)}
    </div>
  );
}
