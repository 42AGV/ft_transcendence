import EditAvatarPage from '../../shared/components/templates/EditAvatarPageTemplate/EditAvatarPageTemplate';
import { AvatarResponseDto } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';
import { usersApi } from '../../shared/services/ApiService';
import { AVATAR_EP_URL } from '../../shared/urls';

export default function EditUserAvatarPage() {
  const { authUser, setAuthUser, isLoading } = useAuth();
  const avatarUrl = `${AVATAR_EP_URL}/${authUser?.avatarId}`;

  const submitPlacement = async (avatarX: number, avatarY: number) => {
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX,
          avatarY,
        },
      })
      .then(() => {
        setAuthUser((prevState) => {
          if (!prevState) return null;
          return { ...prevState, avatarX, avatarY };
        });
      });
  };

  const uploadAvatar = async (file: File | null) => {
    if (file !== null) {
      usersApi
        .userControllerUploadAvatar({ file })
        .then((res: AvatarResponseDto) => {
          setAuthUser((prevState) => {
            if (!prevState) return null;
            const { avatarId } = res;
            return { ...prevState, avatarId };
          });
        });
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
