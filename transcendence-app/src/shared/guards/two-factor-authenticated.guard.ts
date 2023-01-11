import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';

@Injectable()
export class TwoFactorAuthenticatedGuard extends AuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return (
      (await super.canActivate(context)) &&
      request.session.isTwoFactorAuthenticated
    );
  }
}
