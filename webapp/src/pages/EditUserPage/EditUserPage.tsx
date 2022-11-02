import './EditUserPage.css';
import {
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Loading,
} from '../../shared/components';
import { EDIT_AVATAR_URL, AVATAR_EP_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function EditUserPage() {
  const { username } = useParams();
  const { authUser } = useAuth(username);
  const { goBack } = useNavigation();

  return authUser === null ? (
    <div className="edit-user-page">
      <div className="edit-user-loading">
        <Loading />
      </div>
    </div>
  ) : (
    <div className="edit-user-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        edit profile
      </Header>
      <div className="edit-user-avatar">
        <LargeAvatar
          url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
          editUrl={EDIT_AVATAR_URL}
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
