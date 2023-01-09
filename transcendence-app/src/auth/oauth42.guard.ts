import {
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationService } from '../authorization/authorization.service';
import { Action } from '../shared/enums/action.enum';
import { CaslAbilityFactory } from '../authorization/casl-ability.factory';

@Injectable()
export class OAuth42Guard extends AuthGuard('oauth42') {
  private readonly logger = new Logger(OAuth42Guard.name);

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    const authUser =
      await this.authorizationService.getUserWithAuthorizationFromUsername(
        request.user?.username,
      );
    const ability = this.caslAbilityFactory.defineAbilitiesFor(authUser);
    if (ability.cannot(Action.Join, 'transcendence-app')) return false;
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
