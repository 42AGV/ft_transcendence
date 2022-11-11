import { ButtonVariant, Header, IconVariant } from '../../shared/components';
import { CHAT_URL, CHATROOM_URL } from '../../shared/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useCallback, useEffect, useState } from 'react';
import './ChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useAuth } from '../../shared/hooks/UseAuth';

export default function ChatroomDetailsPage() {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const {
    data: chatroom,
    isLoading: isChatroomLoading,
    error,
  } = useData<Chatroom>(getChatroom);
  const { isLoading: isUserLoading, authUser } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (isChatroomLoading || isUserLoading || error) {
      setIsOwner(false);
      return;
    }
    if (authUser!.id === chatroom!.ownerId) {
      setIsOwner(true);
    }
  }, [authUser, isUserLoading, chatroom, isChatroomLoading]);
  const leaveChatroom = useCallback(async () => {
    if (!chatroomId) return;
    try {
      if (isOwner) {
        //TODO warn user this action will remove the channel, and wait for confirmation
      }
      await chatApi.chatControllerLeaveChatroom({ chatroomId: chatroomId });
    } catch (err) {
      console.error(err);
    } finally {
      navigate(`${CHAT_URL}`);
    }
  }, [chatroomId, navigate]);
  const editChatroom = useCallback(async () => {
    if (!chatroomId) return;
    navigate(`${CHATROOM_URL}/${chatroomId}/edit`);
  }, [chatroomId, navigate]);
  const { goBack } = useNavigation();

  let buttonProps = [
    {
      variant: ButtonVariant.WARNING,
      iconVariant: IconVariant.LOGOUT,
      onClick: leaveChatroom,
    },
  ];
  if (isOwner) {
    buttonProps.unshift({
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.EDIT,
      onClick: editChatroom,
    });
  }
  return (
    <div className="chatroom-details-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="button"
        buttonProps={buttonProps}
      >
        chat details
      </Header>
    </div>
  );
}
