import './EditUserPage.css';
import {
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
} from '../../shared/components';
import {
  USER_ME_URL,
  AVATAR_EP_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useEffect } from 'react';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function EditUserPage() {
  const { username } = useParams();
  const { isMe, authUser } = useAuth(username);
  const navigate = useNavigate();
  const { goBackTo } = useNavigation();

  useEffect(() => {
    if (!isMe) {
      navigate('/');
    }
  }, [isMe, navigate]);

  return authUser === null ? (
    <div className="edit-user-page">
      <div className="edit-user-loading">
        <Loading />
      </div>
    </div>
  ) : (
    <div className="edit-user-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBackTo(`${USER_ME_URL}/${authUser.username}`)}
      >
        edit profile
      </Header>
      <div className="edit-user-avatar">
        <LargeAvatar
          url={
            authUser.avatarId
              ? `${AVATAR_EP_URL}/${authUser.avatarId}`
              : WILDCARD_AVATAR_URL
          }
          editUrl={`${USER_ME_URL}/${authUser.username}/edit/avatar`}
          XCoordinate={authUser.avatarX}
          YCoordinate={authUser.avatarY}
        />
      </div>
      <EditUserForm
        origUsername={authUser.username}
        origFullName={authUser.fullName}
        origEmail={authUser.email}
      />
    </div>
  );
}
