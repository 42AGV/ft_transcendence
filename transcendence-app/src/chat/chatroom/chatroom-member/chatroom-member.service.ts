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
import { CaslAbilityFactory } from '../../../authorization/casl-ability.factory';
import { ChatroomMemberWithAuthorization } from '../../../authorization/infrastructure/db/chatroom-member-with-authorization.entity';

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
      chatId,
      userId,
      admin: false,
      muted: false,
      banned: false,
    };
    const ret = await this.chatroomMemberRepository.addChatroomMember(
      chatmember,
    );
    return ret ? new ChatroomMember({ owner: false, ...ret }) : null;
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
    authCrm: ChatroomMemberWithAuthorization | null,
    destCrm: ChatroomMember | null,
    updateChatroomMemberDto: UpdateChatroomMemberDto,
  ): Promise<ChatroomMember | null> {
    if (!authCrm || !destCrm) {
      throw new NotFoundException();
    }
    const ability = this.caslAbilityFactory.defineAbilitiesFor(authCrm);
    if (
      !(
        ability.can(Action.Update, updateChatroomMemberDto) &&
        ability.can(Action.Update, destCrm)
      )
    ) {
      throw new ForbiddenException();
    }
    const { chatId, userId } = destCrm;
    return this.chatroomMemberRepository.updateById(
      chatId,
      userId,
      updateChatroomMemberDto,
    );
  }

  async removeFromChatroom(
    authCrm: ChatroomMemberWithAuthorization | null,
    destCrm: ChatroomMember | null,
  ): Promise<ChatroomMember | null> {
    if (!authCrm || !destCrm) {
      throw new NotFoundException();
    }
    const { chatId, userId } = destCrm;
    const ability = this.caslAbilityFactory.defineAbilitiesFor(authCrm);
    if (ability.cannot(Action.Delete, destCrm)) {
      throw new ForbiddenException();
    }
    if (destCrm.banned || destCrm.muted) {
      return this.chatroomMemberRepository.updateById(chatId, userId, {
        joinedAt: null,
      });
    }
    return this.chatroomMemberRepository.deleteById(chatId, userId);
  }

  async getChatroomMembers(
    authCrm: ChatroomMemberWithAuthorization | null,
    {
      search = '',
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.True,
    }: PaginationWithSearchQueryDto,
  ): Promise<ChatroomMemberWithUser[] | null> {
    if (!authCrm) {
      throw new NotFoundException();
    }
    return this.chatroomMemberRepository.getPaginatedChatroomMembers(
      authCrm.chatId,
      {
        search,
        limit,
        offset,
        sort,
      },
    );
  }
}
