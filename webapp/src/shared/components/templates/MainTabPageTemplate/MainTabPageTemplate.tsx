import './MainTabPageTemplate.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { USER_ME_URL, AVATAR_EP_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import Loading from '../../Loading/Loading';
import { useAuth } from '../../../hooks/UseAuth';
import { Button, ButtonProps, ButtonSize, RowsListTemplate } from '../../index';
import { RowsListTemplateProps } from '../RowsListTemplate/RowsListTemplate';
import { useMediaQuery } from '../../../hooks/UseMediaQuery';
import { calcDownwardsDisplacement } from '../../Header/Header';

export default function MainTabPageTemplate<T>({
  dataMapper,
  buttons,
}: RowsListTemplateProps<T>) {
  const { authUser } = useAuth();
  const windowIsBig = useMediaQuery(768);
  let style: React.CSSProperties | undefined;
  let buttonElements: JSX.Element | undefined = undefined;

  if (buttons !== undefined) {
    let buttonSize = ButtonSize.LARGE;
    if (!windowIsBig) {
      style = {
        transform: `translateY(${calcDownwardsDisplacement(buttons.length)}%)`,
      };
      buttonSize = ButtonSize.SMALL;
    }
    buttonElements = (
      <div className="main-tab-buttons" style={style}>
        {buttons.map((buttonProp: ButtonProps, idx) => (
          <Button
            key={idx}
            {...({
              ...buttonProp,
              buttonSize: buttonSize,
            } as ButtonProps)}
          />
        ))}
      </div>
    );
  }
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
        <div
          className="main-tab-buttons-wrapper"
          style={{
            transform: `translateY(-${calcDownwardsDisplacement(
              buttons.length && windowIsBig ? 0 : buttons.length,
            )}%)`,
          }}
        >
          {buttonElements}
        </div>
      )}
    </div>
  );
}
