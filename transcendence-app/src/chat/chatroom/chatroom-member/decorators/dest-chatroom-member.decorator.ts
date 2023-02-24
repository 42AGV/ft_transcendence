import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';
import { Request } from 'express';

export const GetDestCrMember = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request: Request =
      ctx.getType() === 'http'
        ? ctx.switchToHttp().getRequest()
        : ctx.switchToWs().getClient().request;
    const chatId = request.params[property ?? 'chatroomId'];
    const userId = request.params['userId'];

    return { chatId, userId } as Partial<ChatroomMember>;
  },
);
