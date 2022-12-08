import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditAvatarPage from '../../shared/components/templates/EditAvatarPageTemplate/EditAvatarPageTemplate';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { AvatarResponseDto, Chatroom } from '../../shared/generated';
import { useData } from '../../shared/hooks/UseData';
import { chatApi } from '../../shared/services/ApiService';
import { AVATAR_EP_URL } from '../../shared/urls';

export default function EditChatroomAvatarPage() {
  const { chatroomId } = useParams();
  const getChatRoomById = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const { data: chatroomData, isLoading } = useData(getChatRoomById);
  const avatarUrl = `${AVATAR_EP_URL}/${chatroom?.avatarId}`;
  const { notify, warn } = useNotificationContext();

  const submitPlacement = async (avatarX: number, avatarY: number) => {
    chatApi
      .chatControllerUpdateChatroom({
        chatroomId: chatroomId!,
        updateChatroomDto: {
          avatarX,
          avatarY,
        },
      })
      .then(() => {
        notify('Image visible area saved correctly.');
        setChatroom((prevState) => {
          if (!prevState) return null;
          return { ...prevState, avatarX, avatarY };
        });
      })
      .catch((e) => warn(e.response.statusText));
  };

  const uploadAvatar = async (file: File | null) => {
    if (file !== null) {
      chatApi
        .chatControllerUploadAvatar({ chatroomId: chatroomId!, file })
        .then((res: AvatarResponseDto) => {
          notify('Image uploaded correctly.');
          setChatroom((prevState) => {
            if (!prevState) return null;
            const { avatarId } = res;
            return { ...prevState, avatarId };
          });
        })
        .catch((e) => warn(e.response.statusText));
    }
  };

  useEffect(() => {
    setChatroom(chatroomData);
  }, [chatroomData]);

  return (
    <EditAvatarPage
      isLoading={isLoading}
      model={chatroom}
      avatarUrl={avatarUrl}
      submitPlacement={submitPlacement}
      uploadAvatar={uploadAvatar}
    />
  );
}
