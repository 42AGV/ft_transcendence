import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';

export const GetAuthCrMember = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const chatId = ctx.switchToHttp().getRequest().params[property];
    const authId = ctx.switchToHttp().getRequest().user.id;

    return { chatId, userId: authId } as Partial<ChatroomMember>;
  },
);
