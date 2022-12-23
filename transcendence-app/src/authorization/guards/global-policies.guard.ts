import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard, PolicyHandler } from './base-policies.guard';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { CONFIG_PARAM_KEY } from '../decorators/configure-param.decorator';
import { UserWithAuthorization } from '../infrastructure/db/user-with-authorization.entity';

@Injectable()
export class GlobalPoliciesGuard extends PoliciesGuard {
  constructor(
    reflector: Reflector,
    caslAbilityFactory: CaslAbilityFactory,
    authorizationService: AuthorizationService,
  ) {
    super(reflector, caslAbilityFactory, authorizationService);
  }
  override async getAbilityFromContext(ctx: ExecutionContext) {
    const param =
      this.reflector.get<string>(CONFIG_PARAM_KEY, ctx.getHandler()) || 'id';
    const authId = ctx.switchToHttp().getRequest().user[param];
    let userWithAuthorization: UserWithAuthorization;
    if (param === 'id') {
      userWithAuthorization =
        await this.authorizationService.getUserWithAuthorizationFromId(authId);
    } else {
      userWithAuthorization =
        await this.authorizationService.getUserWithAuthorizationFromUsername(
          authId,
        );
    }
    return this.caslAbilityFactory.defineAbilitiesFor(userWithAuthorization);
  }
}
