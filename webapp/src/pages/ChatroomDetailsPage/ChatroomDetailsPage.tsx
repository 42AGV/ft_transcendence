import { ButtonVariant, Header, IconVariant } from '../../shared/components';
import { CHAT_URL, CHATROOM_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import React, { useCallback, useEffect, useState } from 'react';
import './ChatroomDetailsPage.css';
import { chatApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { Chatroom } from '../../shared/generated/models/Chatroom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { ChatroomMemberWithUser } from '../../shared/generated/models/ChatroomMemberWithUser';
import Loading from '../../shared/components/Loading/Loading';

export default function ChatroomDetailsPage() {
  const { chatroomId } = useParams();
  const { goBack, navigate } = useNavigation();
  const getChatroom = useCallback(
    () => chatApi.chatControllerGetChatroomById({ id: chatroomId! }),
    [chatroomId],
  );
  const { data: chatroom } = useData<Chatroom>(getChatroom);
  const { authUser } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (!(authUser && chatroom)) {
      // TODO: do something if error
      setIsOwner(false);
      return;
    }
    if (authUser.id === chatroom.ownerId) {
      setIsOwner(true);
    }
  }, [authUser, chatroom]);
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
  }, [isOwner, chatroomId, navigate]);
  const editChatroom = useCallback(async () => {
    if (!chatroomId) return;
    navigate(`${CHATROOM_URL}/${chatroomId}/edit`);
  }, [chatroomId, navigate]);

  const retrieveChatroomMembers = useCallback(
    () =>
      chatApi.chatControllerRetrieveChatroomMembers({
        chatroomId: chatroomId!,
      }),
    [chatroomId],
  );
  const {
    data: chatroomMembers,
  } = useData<ChatroomMemberWithUser[]>(retrieveChatroomMembers);

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
  if (!(authUser && chatroom && chatroomMembers)) {
    return (
      <div className="chatroom-details-page">
        <div className="chatroom-details-page-loading">
          <Loading />
        </div>
      </div>
    );
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
