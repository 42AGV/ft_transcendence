import { UpdateChatDto } from 'src/chat/dto/update-chat.dto';
import { ChatsPaginationQueryDto } from 'src/chat/dto/chat.pagination.dto';
import { LocalFile } from '../../../shared/local-file/local-file.domain';
import { Chat } from '../../chat.domain';

export abstract class IChatRepository {
  abstract getById(id: string): Promise<Chat | null>;
  abstract getByChatName(chatName: string): Promise<Chat | null>;
  abstract deleteByChatName(chatName: string): Promise<Chat | null>;
  abstract updateById(
    chatName: string,
    updateChatDto: UpdateChatDto,
  ): Promise<Chat | null>;
  abstract add(chat: Chat): Promise<Chat | null>;
  abstract getPaginatedChats(
    queryDto: Required<ChatsPaginationQueryDto>,
  ): Promise<Chat[] | null>;
  abstract addAvatarAndAddChat(
    avatar: LocalFile,
    chat: Chat,
  ): Promise<Chat | null>;
  abstract addAvatarAndUpdateChat(
    avatar: LocalFile,
    chat: Chat,
  ): Promise<Chat | null>;
}
