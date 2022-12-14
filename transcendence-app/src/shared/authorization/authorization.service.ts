import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ChatroomMemberService } from '../../chat/chatroom/chatroom-member/chatroom-member.service';
import { Role } from '../enums/role.enum';
import { ChatService } from '../../chat/chat.service';
import { AuthUserCtxForChatroomMember } from './authorizationContext/authuser.chatroom-member';
import { AuthUserCtxForChatroom } from './authorizationContext/authuser.chatroom';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ChatroomMemberService))
    private chatroomMemberService: ChatroomMemberService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}

  async GetUserAuthContextForChatroomMember(
    userId: string,
    chatroomId: string,
  ): Promise<AuthUserCtxForChatroomMember> {
    const g_user = await this.userService.getUserWithRolesFromId(userId);
    if (!g_user) {
      throw new UnprocessableEntityException();
    }
    const cr = await this.chatService.getChatroomById(chatroomId);
    if (!cr) {
      throw new NotFoundException();
    }
    const crm = await this.chatroomMemberService.getById(chatroomId, userId);
    const isMember = !!crm && crm.joinedAt !== null;
    return new AuthUserCtxForChatroomMember({
      g_isOwner: g_user.roles.includes(Role.owner),
      g_isModerator: g_user.roles.includes(Role.moderator),
      g_isBanned: g_user.roles.includes(Role.banned),
      crm_isOwner: userId === cr.ownerId,
      crm_isMember: isMember,
      crm_isAdmin: isMember ? crm.admin : undefined,
      crm_isBanned: isMember ? crm.banned : undefined,
    });
  }
  async GetUserAuthContextForChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<AuthUserCtxForChatroom> {
    const crmclass = await this.GetUserAuthContextForChatroomMember(
      userId,
      chatroomId,
    );
    const crm = await this.chatroomMemberService.getById(chatroomId, userId);
    return new AuthUserCtxForChatroom({
      ...crmclass,
      cr_isMuted: crmclass.crm_isMember && crm ? crm.muted : undefined,
    });
  }
}
