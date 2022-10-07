import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Chat = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const chat = request.chat;

    return property ? chat?.[property] : chat;
  },
);
