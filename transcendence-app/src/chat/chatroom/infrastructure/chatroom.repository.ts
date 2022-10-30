import { UpdateChatroomDto } from '../dto/update-chatroom.dto';
import { ChatroomPaginationQueryDto } from '../dto/chatroom.pagination.dto';
import { LocalFile } from '../../../shared/local-file/local-file.domain';
import { Chatroom } from '../chatroom.domain';

export abstract class IChatroomRepository {
  abstract getById(id: string): Promise<Chatroom | null>;
  abstract getByChatRoomName(name: string): Promise<Chatroom | null>;
  abstract deleteByChatRoomName(name: string): Promise<Chatroom | null>;
  abstract updateById(
    name: string,
    updateChatDto: UpdateChatroomDto,
  ): Promise<Chatroom | null>;
  abstract add(chatRoom: Chatroom): Promise<Chatroom | null>;
  abstract getPaginatedChatRooms(
    queryDto: Required<ChatroomPaginationQueryDto>,
  ): Promise<Chatroom[] | null>;
  abstract addAvatarAndAddChatRoom(
    avatar: LocalFile,
    chatRoom: Chatroom,
  ): Promise<Chatroom | null>;
  abstract addAvatarAndUpdateChatRoom(
    avatar: LocalFile,
    chatRoom: Chatroom,
  ): Promise<Chatroom | null>;
}
