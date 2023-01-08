import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  constructor(protected readonly authorizationService: AuthorizationService) {}
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;
    if (!request.isAuthenticated()) {
      return false;
    }
    const authUser =
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user?.username,
      );
    return !authUser.gBanned || authUser.gOwner;
  }
}
