import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(protected readonly authorizationService: AuthorizationService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
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
