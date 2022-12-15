import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { Chatroom } from './chatroom/infrastructure/db/chatroom.entity';
import { IChatroomRepository } from './chatroom/infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/infrastructure/db/chatroom-message-with-user.entity';
import { IChatroomMessageRepository } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.repository';
import { PaginationQueryDto } from '../shared/dtos/pagination.query.dto';
import { Password } from '../shared/password';
import { UpdateChatroomDto } from './chatroom/dto/update-chatroom.dto';
import { IChatMessageRepository } from './chat/infrastructure/db/chat-message.repository';
import { ChatMessage } from './chat/infrastructure/db/chat-message.entity';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { ChatroomMessage } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.entity';
import { JoinChatroomDto } from './chatroom/dto/join-chatroom.dto';
import { ChatroomMember } from './chatroom/chatroom-member/infrastructure/db/chatroom-member.entity';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { User } from '../user/infrastructure/db/user.entity';
import { IChatroomMemberRepository } from './chatroom/chatroom-member/infrastructure/db/chatroom-member.repository';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { ChatroomDto } from './chatroom/dto/chatroom.dto';
import { ChatMessageWithUser } from './chat/infrastructure/db/chat-message-with-user.entity';
import { AvatarService } from '../shared/avatar/avatar.service';
import { AvatarResponseDto } from '../shared/avatar/dto/avatar.response.dto';

@Injectable()
export class ChatService {
  constructor(
    private chatMessageRepository: IChatMessageRepository,
    private chatroomRepository: IChatroomRepository,
    private chatroomMessageRepository: IChatroomMessageRepository,
    private chatroomMemberService: ChatroomMemberService,
    private chatroomMemberRepository: IChatroomMemberRepository,
    private localFileService: LocalFileService,
    private avatarService: AvatarService,
  ) {}

  async retrieveChatrooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: PaginationWithSearchQueryDto): Promise<Chatroom[] | null> {
    return this.chatroomRepository.getPaginatedChatrooms({
      limit,
      offset,
      sort,
      search,
    });
  }

  async retrieveChatroomsforAuthUser(
    user: User,
    {
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.False,
      search = '',
    }: PaginationWithSearchQueryDto,
  ): Promise<Chatroom[] | null> {
    return this.chatroomRepository.getAuthUserPaginatedChatrooms(user.id, {
      limit,
      offset,
      sort,
      search,
    });
  }

  private async addAvatarAndChatroom(
    avatarId: string,
    avatarDto: LocalFileDto,
    chatroom: ChatroomDto,
  ): Promise<Chatroom | null> {
    return this.chatroomRepository.addAvatarAndAddChatroom(
      { id: avatarId, createdAt: new Date(Date.now()), ...avatarDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        avatarX: 0,
        avatarY: 0,
        ...chatroom,
      },
    );
  }

  async createChatroom(ownerId: string, chatroom: CreateChatroomDto) {
    const { confirmationPassword: _, ...newChat } = chatroom;
    const avatarDto = await this.localFileService.createRandomSVGFile(12, 512);
    const avatarId = uuidv4();
    if (chatroom.password) {
      if (chatroom.password !== chatroom.confirmationPassword) {
        throw new BadRequestException(
          'Password and Confirmation Password must match',
        );
      }

      const hashedPassword = await Password.toHash(chatroom.password);
      return this.addAvatarAndChatroom(avatarId, avatarDto, {
        ...newChat,
        avatarId,
        ownerId,
        password: hashedPassword,
      });
    } else {
      return this.addAvatarAndChatroom(avatarId, avatarDto, {
        ...newChat,
        avatarId,
        ownerId,
        password: null,
      });
    }
  }

  getChatroomById(chatroomId: string): Promise<Chatroom | null> {
    return this.chatroomRepository.getById(chatroomId);
  }

  getChatroomMessagesWithUser(
    chatroomId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatroomMessageWithUser[] | null> {
    return this.chatroomMessageRepository.getWithUser(chatroomId, {
      limit,
      offset,
    });
  }

  async saveOneToOneChatMessage(
    message: Partial<ChatMessage>,
  ): Promise<ChatMessage | null> {
    return this.chatMessageRepository.add(message);
  }

  async getOneToOneChatMessages(
    userMeId: string,
    recipientId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatMessageWithUser[] | null> {
    return this.chatMessageRepository.getPaginatedMessages(
      userMeId,
      recipientId,
      {
        limit,
        offset,
      },
    );
  }

  async updateChatroom(
    userMe: User,
    chatroomId: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null> {
    const { oldPassword, confirmationPassword, ...updateChatroom } =
      updateChatroomDto;
    const chatroom = await this.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }

    if (userMe.id !== chatroom.ownerId) {
      throw new ForbiddenException();
    }

    // If the user doesn't update the password, we can update the chatroom without any checks
    if (updateChatroom.password === undefined) {
      return await this.chatroomRepository.updateById(
        chatroomId,
        updateChatroom,
      );
    }

    // Check if the chatroom password matches the old password provided by the user
    if (
      chatroom.password &&
      (!updateChatroomDto.oldPassword ||
        (await Password.compare(
          chatroom.password,
          updateChatroomDto.oldPassword,
        )) === false)
    ) {
      throw new ForbiddenException('Incorrect password');
    }

    // Check if the new password matches the confirmation password
    if (updateChatroomDto.password !== updateChatroomDto.confirmationPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }

    // If the user provided a null password for a public chatroom, we can update directly
    if (updateChatroom.password === null) {
      return await this.chatroomRepository.updateById(
        chatroomId,
        updateChatroom,
      );
    }

    // The user provided a password and we have to encrypt it password before saving it into the database
    const hashedPassword = await Password.toHash(updateChatroom.password);
    const ret = this.chatroomRepository.updateById(chatroomId, {
      ...updateChatroom,
      password: hashedPassword,
    });
    return await ret;
  }

  async deleteChatroom(chatroomId: string): Promise<Chatroom | null> {
    return this.chatroomRepository.deleteById(chatroomId);
  }

  addChatroomMessage(chatroomMessage: Partial<ChatroomMessage>) {
    return this.chatroomMessageRepository.add(chatroomMessage);
  }

  async addChatroomMember(
    chatroomId: string,
    userId: string,
    joinChatroomDto: JoinChatroomDto,
  ): Promise<ChatroomMember | null> {
    const foundChatroom = await this.getChatroomById(chatroomId);
    if (!foundChatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    const { password } = joinChatroomDto;
    if (
      foundChatroom.password &&
      (!password || !(await Password.compare(foundChatroom.password, password)))
    ) {
      throw new ForbiddenException('Incorrect password');
    }
    return this.chatroomMemberService.addChatroomMember(chatroomId, userId);
  }

  private async addAvatarAndUpdateChatroom(
    chatroom: Chatroom,
    newAvatarFileDto: LocalFileDto,
  ): Promise<AvatarResponseDto | null> {
    const avatarUUID = uuidv4();
    const updatedChatroom =
      await this.chatroomRepository.addAvatarAndUpdateChatroom(
        {
          id: avatarUUID,
          createdAt: new Date(Date.now()),
          ...newAvatarFileDto,
        },
        chatroom,
      );
    if (!updatedChatroom) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    return {
      avatarId: avatarUUID,
      file: this.avatarService.streamAvatarData(newAvatarFileDto),
    };
  }

  async addAvatar(
    chatroomId: string,
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<AvatarResponseDto | null> {
    await this.avatarService.validateAvatarType(newAvatarFileDto.path);
    const chatroom = await this.chatroomRepository.getById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    if (chatroom.ownerId !== user.id) {
      throw new ForbiddenException();
    }
    const previousAvatarId = user.avatarId;
    const avatar = await this.addAvatarAndUpdateChatroom(
      chatroom,
      newAvatarFileDto,
    );
    if (!avatar) {
      return null;
    }
    if (previousAvatarId) {
      await this.avatarService.deleteAvatar(previousAvatarId);
    }
    return avatar;
  }
}
