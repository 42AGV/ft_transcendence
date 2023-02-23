import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';
import { Request } from 'express';

export const GetAuthCrMember = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request: Request =
      ctx.getType() === 'http'
        ? ctx.switchToHttp().getRequest()
        : ctx.switchToWs().getClient().request;
    const chatId = request.params[property ?? 'chatroomId'];
    const authId = request.user.id;

    return { chatId, userId: authId } as Partial<ChatroomMember>;
  },
);
