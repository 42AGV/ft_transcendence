import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';

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
    const authId = ctx.switchToHttp().getRequest().user.id;
    const userWithAuthorization =
      await this.authorizationService.getUserWithAuthorizationFromId(authId);

    return this.caslAbilityFactory.defineAbilitiesFor(userWithAuthorization);
  }
}
