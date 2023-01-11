import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsAuthenticatedGuard } from './ws-authenticated.guard';
import { User } from '../../user/infrastructure/db/user.entity';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config/env.validation';
import { AuthorizationService } from '../../authorization/authorization.service';
import { CaslAbilityFactory } from '../../authorization/casl-ability.factory';
import {
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
} from '../constants';

@Injectable()
export class WsTwoFactorAuthenticatedGuard extends WsAuthenticatedGuard {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    authorizationService: AuthorizationService,
    caslAbilityFactory: CaslAbilityFactory,
  ) {
    super(authorizationService, caslAbilityFactory);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const request = client.request;
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
