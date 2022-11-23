import { UpdateChatroomDto } from '../../dto/update-chatroom.dto';
import { LocalFile } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { Chatroom } from './chatroom.entity';
import { PaginationWithSearchQueryDto } from '../../../../shared/dtos/pagination-with-search.query.dto';

export abstract class IChatroomRepository {
  abstract getById(id: string): Promise<Chatroom | null>;
  abstract getByChatroomName(name: string): Promise<Chatroom | null>;
  abstract deleteByChatroomName(name: string): Promise<Chatroom | null>;
  abstract deleteById(id: string): Promise<Chatroom | null>;
  abstract updateById(
    name: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null>;
  abstract getPaginatedChatrooms(
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Chatroom[] | null>;
  abstract getAuthUserPaginatedChatrooms(
    authUserId: string,
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Chatroom[] | null>;
  abstract addAvatarAndAddChatroom(
    avatar: LocalFile,
    chatroom: Omit<Chatroom, 'isPublic'>,
  ): Promise<Chatroom | null>;
  abstract addAvatarAndUpdateChatroom(
    avatar: LocalFile,
    chatroom: Chatroom,
  ): Promise<Chatroom | null>;
}
