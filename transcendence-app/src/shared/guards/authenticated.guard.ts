import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Action } from '../enums/action.enum';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    protected readonly authorizationService: AuthorizationService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
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
