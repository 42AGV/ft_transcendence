import { useCallback } from 'react';
import { chatApi } from '../services/ApiService';
import { useData } from './UseData';

const useGetChatroomMemberCb = (chatroomId: string, id?: string) =>
  useCallback(() => {
    if (!id) {
      return Promise.reject(new Error('The chatroom member could not load'));
    }
    return chatApi.chatControllerGetChatroomMember({
      chatroomId: chatroomId,
      userId: id,
    });
  }, [chatroomId, id]);

export const useGetChatroomMember = (chatroomId: string, id?: string) => {
  return useData(
    useGetChatroomMemberCb(chatroomId, id),
    useCallback(() => {}, []),
  );
};
