import { UpdateChatDto } from '../../../chat/dto/update-chat.dto';
import { ChatsPaginationQueryDto } from '../../../chat/dto/chat.pagination.dto';
import { ChatRoom } from './chat.entity';
import { LocalFile } from '../../../shared/local-file/infrastructure/db/local-file.entity';

export abstract class IChatRepository {
  abstract getById(id: string): Promise<ChatRoom | null>;
  abstract getByChatRoomName(name: string): Promise<ChatRoom | null>;
  abstract deleteByChatRoomName(name: string): Promise<ChatRoom | null>;
  abstract updateById(
    name: string,
    updateChatDto: UpdateChatDto,
  ): Promise<ChatRoom | null>;
  abstract add(chatRoom: Partial<ChatRoom>): Promise<ChatRoom | null>;
  abstract getPaginatedChatRooms(
    queryDto: Required<ChatsPaginationQueryDto>,
  ): Promise<ChatRoom[] | null>;
  abstract addAvatarAndAddChatRoom(
    avatar: LocalFile,
    chatRoom: ChatRoom,
  ): Promise<ChatRoom | null>;
  abstract addAvatarAndUpdateChatRoom(
    avatar: LocalFile,
    chatRoom: ChatRoom,
  ): Promise<ChatRoom | null>;
}
