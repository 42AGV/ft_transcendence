import { UpdateChatroomDto } from '../../dto/update-chatroom.dto';
import { ChatroomPaginationQueryDto } from '../../dto/chatroom.pagination.dto';
import { LocalFile } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { Chatroom } from '../../infrastructure/db/chatroom.entity';

export abstract class IChatroomRepository {
  abstract getById(id: string): Promise<Chatroom | null>;
  abstract getByChatroomName(name: string): Promise<Chatroom | null>;
  abstract deleteByChatroomName(name: string): Promise<Chatroom | null>;
  abstract updateById(
    name: string,
    updateChatDto: UpdateChatroomDto,
  ): Promise<Chatroom | null>;
  abstract add(chatroom: Partial<Chatroom>): Promise<Chatroom | null>;
  abstract getPaginatedChatrooms(
    queryDto: Required<ChatroomPaginationQueryDto>,
  ): Promise<Chatroom[] | null>;
  abstract addAvatarAndAddChatroom(
    avatar: LocalFile,
    chatroom: Chatroom,
  ): Promise<Chatroom | null>;
  abstract addAvatarAndUpdateChatroom(
    avatar: LocalFile,
    chatroom: Chatroom,
  ): Promise<Chatroom | null>;
}
