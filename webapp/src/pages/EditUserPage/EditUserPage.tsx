import { AvatarPageTemplate, EditUserForm } from '../../shared/components';
import { EDIT_AVATAR_URL, AVATAR_EP_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';

export default function EditUserPage() {
  const { username } = useParams();
  const { authUser, isLoading } = useAuth(username);

  return (
    <AvatarPageTemplate
      isLoading={isLoading}
      isNotFound={!authUser}
      title="edit profile"
      avatarProps={{
        url: `${AVATAR_EP_URL}/${authUser!.avatarId}`,
        editUrl: EDIT_AVATAR_URL,
        XCoordinate: authUser!.avatarX,
        YCoordinate: authUser!.avatarY,
      }}
    >
      <div className="edit-user-page-content">
        <EditUserForm
          origUsername={authUser!.username}
          origFullName={authUser!.fullName}
          origEmail={authUser!.email}
        />
      </div>
    </AvatarPageTemplate>
  );
}
