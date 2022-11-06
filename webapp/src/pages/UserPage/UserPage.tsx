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
  Button,
  ButtonVariant,
} from '../../shared/components';
import { AVATAR_EP_URL } from '../../shared/urls';
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
  const { blockRelation, unblockUser, blockUser } = useBlock(user);

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
          url={`${AVATAR_EP_URL}/${user.avatarId}`}
          caption="level 4"
          XCoordinate={user.avatarX}
          YCoordinate={user.avatarY}
        />
        <div className="user-text">
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {user.fullName}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {user.email}
          </Text>
        </div>
        <div className="user-block-status-toggle">
          {blockRelation !== null && (
            <ToggleSwitch
              label={blockRelation.isUserBlocked ? 'Unblock' : 'Block'}
              isToggled={blockRelation.isUserBlocked ?? false}
              onToggle={blockRelation.isUserBlocked ? unblockUser : blockUser}
            />
          )}
        </div>
      </div>
      {blockRelation !== null && (
        <div className="user-page-chat-button">
          <Button
            disabled={
              (blockRelation.amIBlocked || blockRelation.isUserBlocked) ?? false
            }
            variant={ButtonVariant.SUBMIT}
            iconVariant={IconVariant.SEND}
          >
            Send message
          </Button>
        </div>
      )}
    </div>
  );
}
