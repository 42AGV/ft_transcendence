import './UserPage.css';
import {
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
  ToggleSwitch,
} from '../../shared/components';
import { WILDCARD_AVATAR_URL, AVATAR_EP_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useBlock } from '../../shared/hooks/UseBlock';

export default function UserPage() {
  const { username } = useParams();
  const getUserByUserName = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading } = useData(getUserByUserName);
  const { goBack } = useNavigation();
  const { isBlocked, unblockUser, blockUser } = useBlock(user);

  if (isLoading) {
    return (
      <div className="user-page">
        <div className="user-page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return user === null ? (
    <NotFoundPage />
  ) : (
    <div className="user-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="online"
      >
        {user.username}
      </Header>
      <div className="user-wrapper">
        <LargeAvatar
          url={
            user.avatarId
              ? `${AVATAR_EP_URL}/${user.avatarId}`
              : WILDCARD_AVATAR_URL
          }
          caption="level 4"
          XCoordinate={user.avatarX}
          YCoordinate={user.avatarY}
        />
        <div className="user-text">
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {user.fullName}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH} // this size doesn't look like in figma
            color={TextColor.LIGHT} // at least for desktop
            weight={TextWeight.MEDIUM}
          >
            {user.email}
          </Text>
        </div>
        <div className="user-block-status-toggle">
          {isBlocked !== null && (
            <ToggleSwitch
              label={isBlocked ? 'Unblock' : 'Block'}
              isToggled={isBlocked ?? false}
              onToggle={isBlocked ? unblockUser : blockUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}
