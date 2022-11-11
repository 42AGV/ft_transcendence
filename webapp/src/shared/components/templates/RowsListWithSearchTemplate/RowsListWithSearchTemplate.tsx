import './RowsListWithSearchTemplate.css';
import * as React from 'react';
import SearchForm from '../../Input/SearchForm';
import RowsList, { RowItem } from '../../RowsList/RowsList';
import Loading from '../../Loading/Loading';
import { useSearchContext } from '../../../context/SearchContext';

type RowsListWithSearchTemplate<T> = {
  dataMapper: (data: T) => RowItem;
};

export default function RowsListWithSearchTemplate<T>({
  dataMapper,
}: RowsListWithSearchTemplate<T>) {
  const { result, fetchMoreResults } = useSearchContext();

  const data = ((array: object): RowItem[] | null => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map((el) => dataMapper(el));
  })(result.data);

  if (!data) {
    return (
      <div className="rows-list-with-search-template">
        <div className="rows-list-with-search-template-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="rows-list-with-search-template">
      <div className="rows-list-with-search-template-search">
        <SearchForm />
      </div>
      <div className="rows-list-with-search-template-rows">
        <RowsList rows={data} onLastRowVisible={fetchMoreResults} />
      </div>
    </div>
  );
}
