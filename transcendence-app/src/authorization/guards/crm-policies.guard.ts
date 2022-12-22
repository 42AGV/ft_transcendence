import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';

@Injectable()
export class CrMemberPoliciesGuard extends PoliciesGuard {
  constructor(
    reflector: Reflector,
    caslAbilityFactory: CaslAbilityFactory,
    authorizationService: AuthorizationService,
  ) {
    super(reflector, caslAbilityFactory, authorizationService);
  }

  override async getAbilityFromContext(ctx: ExecutionContext) {
    const chatId = ctx.switchToHttp().getRequest().params['chatroomId'];
    const authId = ctx.switchToHttp().getRequest().user.id;
    const authCrm =
      await this.authorizationService.getUserAuthContextForChatroom(
        authId,
        chatId,
      );
    return await this.caslAbilityFactory.defineAbilitiesFor(authCrm);
  }
}
