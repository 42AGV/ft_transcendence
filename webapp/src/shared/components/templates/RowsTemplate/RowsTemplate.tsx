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
import { UseIsElementVisible } from '../../../hooks/UseIsElementVisible';

type RowsTemplateProps = {
  setIsLastRow: React.Dispatch<React.SetStateAction<boolean>>;
  data: RowItem[] | null;
  isLoading: boolean;
  hasMore: boolean;
};

// Check and map in a single iteration to reduce calculations,
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

export default function RowsTemplate({
  data,
  setIsLastRow,
  isLoading,
}: RowsTemplateProps) {
  // Mover a un componente navigation
  const getCurrentUser = React.useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const { data: user } = useData(getCurrentUser);
  //

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
          onLastRowVisible={() => console.log('is visible!')}
        />
      </div>
      <div className="rows-template-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
