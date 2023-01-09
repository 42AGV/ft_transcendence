import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CaslAbilityFactory } from 'src/authorization/casl-ability.factory';
import { AuthorizationService } from '../authorization/authorization.service';
import { Action } from '../shared/enums/action.enum';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
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
}
