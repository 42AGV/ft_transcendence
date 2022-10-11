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
import { useSearchContext } from '../../../context/SearchContext';

type RowsTemplateProps<T> = {
  dataValidator: (data: T) => boolean;
  dataMapper: (data: T) => RowItem;
};

export default function RowsTemplate<T>({
  dataValidator,
  dataMapper,
}: RowsTemplateProps<T>) {
  const { result, fetchMoreResults } = useSearchContext();

  const data = ((array: object): RowItem[] | null => {
    let rows = [];

    if (!Array.isArray(array)) {
      return null;
    }
    for (let i = 0; i < array.length; i++) {
      if (!dataValidator(array[i])) {
        return null;
      }
      rows.push(dataMapper(array[i]));
    }
    return rows;
  })(result.data);

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
        <RowsList rows={data} onLastRowVisible={fetchMoreResults} />
      </div>
      <div className="rows-template-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
