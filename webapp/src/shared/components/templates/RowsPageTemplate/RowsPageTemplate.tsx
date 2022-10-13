import './RowsPageTemplate.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import SearchForm from '../../Input/SearchForm';
import RowsList, { RowItem } from '../../RowsList/RowsList';
import NavigationBar from '../../NavigationBar/NavigationBar';
import Loading from '../../Loading/Loading';
import { useSearchContext } from '../../../context/SearchContext';
import { useAuth } from '../../../hooks/UseAuth';

type RowsPageTemplateProps<T> = {
  dataMapper: (data: T) => RowItem;
};

export default function RowsPageTemplate<T>({
  dataMapper,
}: RowsPageTemplateProps<T>) {
  const { result, fetchMoreResults } = useSearchContext();
  const { authUser } = useAuth();

  const data = ((array: object): RowItem[] | null => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map((el) => dataMapper(el));
  })(result.data);

  if (!(authUser && data)) {
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
        <Link to={`${USER_URL}/${authUser.username}`}>
          <MediumAvatar
            url={
              authUser.avatarId
                ? `${AVATAR_EP_URL}/${authUser.avatarId}`
                : WILDCARD_AVATAR_URL
            }
            XCoordinate={authUser.avatarX ?? 0}
            YCoordinate={authUser.avatarY ?? 0}
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
