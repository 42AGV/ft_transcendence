import SearchForm from '../../Input/SearchForm';
import RowsList, { RowItem } from '../../RowsList/RowsList';
import Loading from '../../Loading/Loading';
import { useSearchContext } from '../../../context/SearchContext';

type RowsListTemplateProps<T> = {
  dataMapper: (data: T) => RowItem;
};

export default function RowsListTemplate<T>({
  dataMapper,
}: RowsListTemplateProps<T>) {
  const { result, fetchMoreResults } = useSearchContext();

  const data = ((array: object): RowItem[] | null => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map((el) => dataMapper(el));
  })(result.data);

  if (!data) {
    return (
      <div className="rows-list-template">
        <div className="rows-list-template-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rows-list-template-search">
        <SearchForm />
      </div>
      <div className="rows-list-template-rows">
        <RowsList rows={data} onLastRowVisible={fetchMoreResults} />
      </div>
    </>
  );
}
