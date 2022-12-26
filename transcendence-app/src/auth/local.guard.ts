import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor(private readonly authorizationService: AuthorizationService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    const isBanned: boolean = (
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user.username,
      )
    ).g_banned;
    if (isBanned) {
      return false;
    }
    await super.logIn(request);
    return result;
  }
}
