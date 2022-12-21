import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';

export const GetDestCrMember = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const chatId = ctx.switchToHttp().getRequest().params[property ?? 'chatId'];
    const userId = ctx.switchToHttp().getRequest().params['userId'];

    return { chatId, userId } as Partial<ChatroomMember>;
  },
);
