import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';

@Injectable()
export class CrMemberPoliciesGuard extends PoliciesGuard {
  constructor(
    protected reflector: Reflector,
    protected caslAbilityFactory: CaslAbilityFactory,
    protected readonly authorizationService: AuthorizationService,
  ) {
    super(reflector, caslAbilityFactory, authorizationService);
  }
  override async getAbilityFromContext(ctx: ExecutionContext) {
    const authId = ctx.switchToHttp().getRequest().user.id;
    const authCrm =
      await this.authorizationService.getUserWithAuthorizationFromId(authId);

    return await this.caslAbilityFactory.defineAbilitiesFor(authCrm);
  }
}
