import { ChatRoomMessageWithUserEntity } from './chat-room-message-with-user.entity';
import { ChatRoomMessageEntity } from './chat-room-message.entity';

export abstract class IChatroomMessageRepository {
  abstract add(
    chatRoomMessage: ChatRoomMessageEntity,
  ): Promise<ChatRoomMessageEntity | null>;
  abstract getWithUser(
    chatRoomId: string,
  ): Promise<ChatRoomMessageWithUserEntity[] | null>;
}
