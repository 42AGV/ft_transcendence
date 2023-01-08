import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  constructor(protected readonly authorizationService: AuthorizationService) {}
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;
    const authUser =
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user?.username,
      );
    const isAuthenticated: boolean = request.isAuthenticated();
    const isAuthorized = !authUser.gBanned && !authUser.gOwner;
    return isAuthenticated && isAuthorized;
  }
}
