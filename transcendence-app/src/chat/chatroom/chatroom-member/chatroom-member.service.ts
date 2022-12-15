import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IChatroomMemberRepository } from './infrastructure/db/chatroom-member.repository';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './infrastructure/db/chatroom-member.entity';
import { IChatroomRepository } from '../infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../../../shared/constants';
import { PaginationWithSearchQueryDto } from '../../../shared/dtos/pagination-with-search.query.dto';
import { BooleanString } from '../../../shared/enums/boolean-string.enum';
import { UpdateChatroomMemberDto } from './dto/update-chatroom-member.dto';
import { Action } from '../../../shared/enums/action.enum';
import { CaslAbilityFactory } from '../../../shared/authorization/casl-ability.factory';
import { User } from '../../../user/infrastructure/db/user.entity';

@Injectable()
export class ChatroomMemberService {
  constructor(
    private chatroomMemberRepository: IChatroomMemberRepository,
    private chatroomRepository: IChatroomRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async addChatroomMember(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const chatmember = {
      joinedAt: new Date(Date.now()),
      chatId: chatId,
      userId: userId,
      admin: false,
      muted: false,
      banned: false,
    };
    const ret = await this.chatroomMemberRepository.addChatroomMember(
      chatmember,
    );
    return ret ? new ChatroomMember(ret) : null;
  }

  async getById(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const chatMember = await this.chatroomMemberRepository.getById(
      chatId,
      userId,
    );
    return chatMember ?? null;
  }

  async updateChatroomMember(
    authUser: User,
    chatroomId: string,
    userId: string,
    updateChatroomMemberDto: UpdateChatroomMemberDto,
  ): Promise<ChatroomMember | null> {
    const ability = await this.caslAbilityFactory.defineAbilitiesForCrm(
      authUser.id,
      chatroomId,
    );
    if (ability.cannot(Action.Update, updateChatroomMemberDto)) {
      throw new ForbiddenException();
    }
    return this.chatroomMemberRepository.updateById(
      chatroomId,
      userId,
      updateChatroomMemberDto,
    );
  }

  async removeFromChatroom(
    chatroomId: string,
    authUserId: string,
    toDeleteUserId: string,
  ): Promise<ChatroomMember | null> {
    const ability = await this.caslAbilityFactory.defineAbilitiesForCrm(
      authUserId,
      chatroomId,
    );
    const toDeleteChatroomMember = await this.getById(
      chatroomId,
      toDeleteUserId,
    );
    if (!toDeleteChatroomMember) {
      throw new NotFoundException();
    }
    if (ability.cannot(Action.Delete, toDeleteChatroomMember)) {
      throw new ForbiddenException();
    }
    if (toDeleteChatroomMember.banned || toDeleteChatroomMember.muted) {
      return this.chatroomMemberRepository.updateById(
        chatroomId,
        toDeleteUserId,
        {
          joinedAt: null,
        },
      );
    }
    return this.chatroomMemberRepository.deleteById(chatroomId, toDeleteUserId);
  }

  async getChatroomMembers(
    userId: string,
    chatroomId: string,
    {
      search = '',
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.True,
    }: PaginationWithSearchQueryDto,
  ): Promise<ChatroomMemberWithUser[] | null> {
    const ability = await this.caslAbilityFactory.defineAbilitiesForCrm(
      userId,
      chatroomId,
    );
    if (ability.cannot(Action.Read, 'ChatroomMember')) {
      throw new ForbiddenException();
    }
    return this.chatroomMemberRepository.getPaginatedChatroomMembers(
      chatroomId,
      {
        search,
        limit,
        offset,
        sort,
      },
    );
  }
}
