import {
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class OAuth42Guard extends AuthGuard('oauth42') {
  private readonly logger = new Logger(OAuth42Guard.name);

  constructor(private readonly authorizationService: AuthorizationService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    const isBanned = (
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user.username,
      )
    ).gBanned;
    if (isBanned) {
      return false;
    }
    await super.logIn(request);
    return result;
  }

  handleRequest<User>(err: Error, user: User) {
    if (err || !user) {
      err && this.logger.error(err.message);
      throw new ServiceUnavailableException();
    }
    return user;
  }
}
