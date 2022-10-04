import './RowsTemplate.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import SearchForm from '../../Input/SearchForm';
import RowsList, { RowItem } from '../../RowsList/RowsList';
import NavigationBar from '../../NavigationBar/NavigationBar';
import { useData } from '../../../hooks/UseData';
import Loading from '../../Loading/Loading';
import { usersApi } from '../../../services/ApiService';
import UseSearch from '../../../hooks/UseSearch';
import { useSearchContext } from '../../../context/SearchContext';

type RowsTemplateProps<T> = {
  fetchFn: (requestParams: {}) => Promise<T[]>;
  maxEntries: number;
  dataValidator: (data: T) => boolean;
  dataMapper: (data: T) => RowItem;
};

export function validateAndMapDataToRow<T>(
  elementChecker: (object: any) => boolean,
  rowMapper: (data: T) => RowItem,
  array: object,
): RowItem[] | null {
  let rows = [];

  if (!Array.isArray(array)) {
    return null;
  }
  for (let i = 0; i < array.length; i++) {
    if (!elementChecker(array[i])) {
      return null;
    }
    rows.push(rowMapper(array[i]));
  }
  return rows;
}

export default function RowsTemplate<T>({
  fetchFn,
  maxEntries,
  dataValidator,
  dataMapper,
}: RowsTemplateProps<T>) {
  const { result, isLoading } = UseSearch(fetchFn, maxEntries);
  const data = validateAndMapDataToRow(dataValidator, dataMapper, result.data);
  const { query, setQuery } = useSearchContext();

  const getCurrentUser = React.useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const { data: user } = useData(getCurrentUser);

  if (!(user && data)) {
    return (
      <div className="rows-template">
        <div className="rows-template-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="rows-template">
      <div className="rows-template-avatar">
        <Link to={USER_URL}>
          <MediumAvatar
            url={
              user.avatarId
                ? `${AVATAR_EP_URL}/${user.avatarId}`
                : WILDCARD_AVATAR_URL
            }
            XCoordinate={user.avatarX ?? 0}
            YCoordinate={user.avatarY ?? 0}
          />
        </Link>
      </div>
      <div className="rows-template-search">
        <SearchForm />
      </div>
      <div className="rows-template-rows">
        <RowsList
          rows={data}
          onLastRowVisible={() => {
            console.log(result);
            if (!isLoading && result.hasMore) {
              setQuery({ search: query.search, offset: data.length });
            }
          }}
        />
      </div>
      <div className="rows-template-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
