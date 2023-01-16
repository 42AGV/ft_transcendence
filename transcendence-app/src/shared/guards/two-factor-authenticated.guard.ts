import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';
import { User } from '../../user/infrastructure/db/user.entity';
import { AuthorizationService } from '../../authorization/authorization.service';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';
import {
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
} from '../constants';
import { Request } from 'express';

@Injectable()
export class TwoFactorAuthenticatedGuard extends AuthenticatedGuard {
  constructor(
    authorizationService: AuthorizationService,
    caslAbilityFactory: CaslAbilityFactory,
  ) {
    super(authorizationService, caslAbilityFactory);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : context.switchToWs().getClient().request;
    const user: User | null = request.user;
    const isAuth = await super.canActivate(context);

    if (!user?.isTwoFactorAuthenticationEnabled) {
      return isAuth;
    }
    const isTwoFactorAuthenticated =
      request.signedCookies[IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME] ===
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE;
    return isAuth && isTwoFactorAuthenticated;
  }
}
