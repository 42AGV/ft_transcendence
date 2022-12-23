import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';
import { CONFIG_PARAM_KEY } from '../decorators/configure-param.decorator';

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
    const param =
      this.reflector.get<string>(CONFIG_PARAM_KEY, ctx.getHandler()) ||
      'chatroomId';
    const chatId = ctx.switchToHttp().getRequest().params[param];
    const authId = ctx.switchToHttp().getRequest().user.id;
    const authCrm =
      await this.authorizationService.getUserAuthContextForChatroom(
        authId,
        chatId,
      );
    return this.caslAbilityFactory.defineAbilitiesFor(authCrm);
  }
}
