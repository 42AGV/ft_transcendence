import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsAuthenticatedGuard } from './ws-authenticated.guard';

@Injectable()
export class WsTwoFactorAuthenticatedGuard extends WsAuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const request = client.request;
    return (
      (await super.canActivate(context)) &&
      request.session.isTwoFactorAuthenticated
    );
  }
}
