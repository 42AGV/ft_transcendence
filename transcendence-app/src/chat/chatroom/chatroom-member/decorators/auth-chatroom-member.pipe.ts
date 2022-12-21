import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';
import { AuthorizationService } from '../../../../authorization/authorization.service';
import { ChatroomMemberWithAuthorization } from '../../../../authorization/infrastructure/db/chatroom-member-with-authorization.entity';

@Injectable()
export class AuthChatroomMemberPipe
  implements
    PipeTransform<
      Partial<ChatroomMember>,
      Promise<ChatroomMemberWithAuthorization | null>
    >
{
  constructor(private readonly authorizationService: AuthorizationService) {}

  transform(
    data: Partial<ChatroomMember>,
    metadata: ArgumentMetadata,
  ): Promise<ChatroomMemberWithAuthorization | null> {
    void metadata;
    if (!data?.chatId || !data?.userId) return new Promise(() => null);
    return this.authorizationService.getUserAuthContextForChatroom(
      data.userId,
      data.chatId,
    );
  }
}
