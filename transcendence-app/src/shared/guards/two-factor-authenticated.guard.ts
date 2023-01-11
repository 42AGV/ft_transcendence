import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';
import { User } from '../../user/infrastructure/db/user.entity';
// import { TWO_FACTOR_AUTHENTICATION_COOKIE_NAME } from '../constants';
import { EnvironmentVariables } from '../../config/env.validation';
import { ConfigService } from '@nestjs/config';
import { AuthorizationService } from '../../authorization/authorization.service';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';
import {
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
} from '../constants';

@Injectable()
export class TwoFactorAuthenticatedGuard extends AuthenticatedGuard {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    authorizationService: AuthorizationService,
    caslAbilityFactory: CaslAbilityFactory,
  ) {
    super(authorizationService, caslAbilityFactory);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const isAuth = await super.canActivate(context);

    if (!user.isTwoFactorAuthenticationEnabled) {
      return isAuth;
    }
    const isTwoFactorAuthenticated =
      request.signedCookies[IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME] ===
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE;
    return isAuth && isTwoFactorAuthenticated;
  }
}
