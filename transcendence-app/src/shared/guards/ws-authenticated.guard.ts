import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';
import { Action } from '../enums/action.enum';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  constructor(
    protected readonly authorizationService: AuthorizationService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
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
    const ability = this.caslAbilityFactory.defineAbilitiesFor(authUser);
    return ability.can(Action.Join, 'transcendence-app');
  }
}
