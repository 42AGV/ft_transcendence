import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsAuthenticatedGuard } from './ws-authenticated.guard';
import { User } from '../../user/infrastructure/db/user.entity';

@Injectable()
export class WsTwoFactorAuthenticatedGuard extends WsAuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const request = client.request;
    const user: User = request.user;
    const isAuthenticated = await super.canActivate(context);

    if (!user.isTwoFactorAuthenticationEnabled) {
      return isAuthenticated;
    }
    return isAuthenticated && request.session.isTwoFactorAuthenticated;
  }
}
