import './EditUserPage.css';
import {
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
} from '../../shared/components';
import {
  EDIT_AVATAR_URL,
  USERS_EP_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { goBack } from '../../shared/callbacks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';

export default function EditUserPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return user === null ? (
    <div className="edit-user-page">
      <div className="edit-user-loading">
        <Loading />
      </div>
    </div>
  ) : (
    <div className="edit-user-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack(navigate)}>
        edit profile
      </Header>
      <div className="edit-user-avatar">
        <LargeAvatar
          url={
            user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : WILDCARD_AVATAR_URL
          }
          editUrl={EDIT_AVATAR_URL}
          XCoordinate={user.avatarX}
          YCoordinate={user.avatarY}
        />
      </div>
      <EditUserForm
        origUsername={user.username}
        origFullName={user.fullName}
        origEmail={user.email}
      />
    </div>
  );
}
