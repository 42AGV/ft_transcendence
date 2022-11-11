import './RowsPageTemplate.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { USER_ME_URL, AVATAR_EP_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import { RowItem } from '../../RowsList/RowsList';
import NavigationBar from '../../NavigationBar/NavigationBar';
import Loading from '../../Loading/Loading';
import { useAuth } from '../../../hooks/UseAuth';
import RowsListWithSearchTemplate from '../RowsListWithSearchTemplate/RowsListWithSearchTemplate';

type RowsPageTemplateProps<T> = {
  dataMapper: (data: T) => RowItem;
};

export default function RowsPageTemplate<T>({
  dataMapper,
}: RowsPageTemplateProps<T>) {
  const { authUser } = useAuth();

  if (!authUser) {
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
        <Link to={`${USER_ME_URL}`}>
          <MediumAvatar
            url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
            XCoordinate={authUser.avatarX ?? 0}
            YCoordinate={authUser.avatarY ?? 0}
          />
        </Link>
      </div>
      <RowsListWithSearchTemplate dataMapper={dataMapper} />
      <div className="rows-template-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
