import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';
import { User } from '../../user/infrastructure/db/user.entity';

@Injectable()
export class TwoFactorAuthenticatedGuard extends AuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const isAuthenticated = await super.canActivate(context);

    if (!user.isTwoFactorAuthenticationEnabled) {
      return isAuthenticated;
    }
    return isAuthenticated && request.session.isTwoFactorAuthenticated;
  }
}
