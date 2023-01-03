import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(protected readonly authorizationService: AuthorizationService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated: boolean = request.isAuthenticated();
    const isAuthorized: boolean = !(
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user?.username,
      )
    ).gBanned;
    return isAuthenticated && isAuthorized;
  }
}
