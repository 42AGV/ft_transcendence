import EditAvatarPage from '../../shared/components/templates/EditAvatarPageTemplate/EditAvatarPageTemplate';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { User } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';
import { AVATAR_EP_URL } from '../../shared/urls';

export default function EditUserAvatarPage() {
  const { authUser, setAuthUser, isLoading } = useAuth();
  const avatarUrl = `${AVATAR_EP_URL}/${authUser?.avatarId}`;
  const { notify, warn } = useNotificationContext();

  const submitPlacement = async (avatarX: number, avatarY: number) => {
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX,
          avatarY,
        },
      })
      .then(() => {
        notify('Image visible area saved correctly.');
        setAuthUser((prevState) => {
          if (!prevState) return null;
          return { ...prevState, avatarX, avatarY };
        });
      })
      .catch((e) => warn(e.response.statusText));
  };

  const uploadAvatar = async (file: File | null) => {
    if (file !== null && !isLoading && authUser) {
      usersApi
        .userControllerUploadAvatar({ file })
        .then((updatedUser: User) => {
          const { gOwner, gAdmin, gBanned } = authUser;
          notify('Image uploaded correctly.');
          setAuthUser({ ...updatedUser, gOwner, gAdmin, gBanned });
        })
        .catch((e) => warn(e.response.statusText));
    }
  };

  return (
    <EditAvatarPage
      isLoading={isLoading}
      model={authUser}
      avatarUrl={avatarUrl}
      submitPlacement={submitPlacement}
      uploadAvatar={uploadAvatar}
    />
  );
}
