import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
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
import { AuthorizationService } from '../../../shared/authorization/authorization.service';

@Injectable()
export class ChatroomMemberService {
  constructor(
    private chatroomMemberRepository: IChatroomMemberRepository,
    private chatroomRepository: IChatroomRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(forwardRef(() => AuthorizationService))
    private authorizationService: AuthorizationService,
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

  updateById(
    chatId: string,
    userId: string,
    updateChatroomMemberDto: UpdateChatroomMemberDto,
  ): Promise<ChatroomMember | null> {
    return this.chatroomMemberRepository.updateById(
      chatId,
      userId,
      updateChatroomMemberDto,
    );
  }

  async removeFromChatroom(
    chatroomId: string,
    authUserId: string,
    toDeleteUserId: string,
  ): Promise<ChatroomMember | null> {
    const userWithAuth =
      await this.authorizationService.GetUserAuthContextForChatroomMember(
        authUserId,
        chatroomId,
      );
    if (!userWithAuth) {
      throw new NotFoundException();
    }
    const ability = await this.caslAbilityFactory.defineAbilitiesForCrm(
      userWithAuth,
    );
    const toDeleteChatroomMember = await this.getById(
      chatroomId,
      toDeleteUserId,
    );
    if (!toDeleteChatroomMember) {
      throw new NotFoundException();
    }
    console.log(userWithAuth);
    console.log(toDeleteChatroomMember);
    console.log(ability.can(Action.Manage, toDeleteChatroomMember));
    console.log(ability.can(Action.Create, toDeleteChatroomMember));
    console.log(ability.can(Action.Read, toDeleteChatroomMember));
    console.log(ability.can(Action.Update, toDeleteChatroomMember));
    console.log(ability.can(Action.Delete, toDeleteChatroomMember));
    if (!ability.can(Action.Delete, toDeleteChatroomMember)) {
      throw new ForbiddenException();
    }

    const foundChatroom = await this.chatroomRepository.getById(chatroomId);
    if (!foundChatroom) {
      throw new NotFoundException();
    }
    const foundChatroomAuthMember = await this.chatroomMemberRepository.getById(
      chatroomId,
      authUserId,
    );
    if (!foundChatroomAuthMember) {
      throw new NotFoundException();
    }
    const foundChatroomMemberToDelete =
      await this.chatroomMemberRepository.getById(chatroomId, toDeleteUserId);
    if (!foundChatroomMemberToDelete) {
      throw new NotFoundException();
    }
    if (
      foundChatroomMemberToDelete.banned ||
      foundChatroomMemberToDelete.muted
    ) {
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

  async leaveChatroom(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const foundChatroom = await this.chatroomRepository.getById(chatroomId);
    if (!foundChatroom) {
      throw new NotFoundException();
    }
    const foundChatroomMember = await this.chatroomMemberRepository.getById(
      chatroomId,
      userId,
    );
    if (!foundChatroomMember) {
      throw new NotFoundException();
    }
    if (foundChatroom.ownerId === userId) {
      const chatroom = await this.chatroomRepository.deleteById(chatroomId);
      if (!chatroom) {
        throw new ServiceUnavailableException();
      }
      return foundChatroomMember;
    }
    if (foundChatroomMember.banned || foundChatroomMember.muted) {
      return this.chatroomMemberRepository.updateById(chatroomId, userId, {
        joinedAt: null,
      });
    }
    return this.chatroomMemberRepository.deleteById(chatroomId, userId);
  }

  async getChatroomMembers(
    chatroomId: string,
    {
      search = '',
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.True,
    }: PaginationWithSearchQueryDto,
  ): Promise<ChatroomMemberWithUser[] | null> {
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
