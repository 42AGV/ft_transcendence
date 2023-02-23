import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Action } from '../enums/action.enum';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    protected readonly authorizationService: AuthorizationService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : context.switchToWs().getClient().request;

    if (!request.isAuthenticated()) {
      return false;
    }
    const authUser =
      await this.authorizationService.getUserWithAuthorizationFromId(
        request.user?.id,
      );
    const ability = this.caslAbilityFactory.defineAbilitiesFor(authUser);
    return ability.can(Action.Join, 'transcendence-app');
  }
}
