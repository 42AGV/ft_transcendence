import './MainTabPageTemplate.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { USER_ME_URL, AVATAR_EP_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import Loading from '../../Loading/Loading';
import { useAuth } from '../../../hooks/UseAuth';
import {
  ButtonProps,
  ReactiveButton,
  RowItem,
  RowsListTemplate,
} from '../../index';

export type MainTabPageTemplateProps<T> = {
  dataMapper: (data: T) => RowItem;
  buttons?: ButtonProps[];
};

export default function MainTabPageTemplate<T>({
  dataMapper,
  buttons,
}: MainTabPageTemplateProps<T>) {
  const { authUser } = useAuth();

  if (!authUser) {
    return (
      <div className="main-tab-template">
        <div className="main-tab-template-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="main-tab-template">
      <div className="main-tab-template-avatar">
        <Link to={`${USER_ME_URL}`}>
          <MediumAvatar
            url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
            XCoordinate={authUser.avatarX ?? 0}
            YCoordinate={authUser.avatarY ?? 0}
          />
        </Link>
      </div>
      <RowsListTemplate dataMapper={dataMapper} />
      <div className="main-tab-template-navigation">
        <NavigationBar />
      </div>
      {buttons && (
        <div className="main-tab-buttons">
          {buttons.map((buttonProp: ButtonProps, idx) => (
            <ReactiveButton key={idx} {...buttonProp} />
          ))}
        </div>
      )}
    </div>
  );
}
