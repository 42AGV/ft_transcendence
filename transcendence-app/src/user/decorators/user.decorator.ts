import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request: Request =
      ctx.getType() === 'http'
        ? ctx.switchToHttp().getRequest()
        : ctx.switchToWs().getClient().request;
    const user = request.user;

    return property ? user?.[property] : user;
  },
);
