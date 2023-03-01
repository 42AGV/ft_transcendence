import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';
import { Request } from 'express';

@Injectable()
export class CrMemberPoliciesGuard extends PoliciesGuard {
  constructor(
    reflector: Reflector,
    caslAbilityFactory: CaslAbilityFactory,
    authorizationService: AuthorizationService,
  ) {
    super(reflector, caslAbilityFactory, authorizationService);
  }

  override async getAbilityFromRequest(req: Request, param: string) {
    const chatId = req.params[param];
    const authId = req.user.id;
    const authCrm =
      await this.authorizationService.getUserAuthContextForChatroom(
        authId,
        chatId,
      );
    if (!authCrm) {
      return null;
    }
    return this.caslAbilityFactory.defineAbilitiesFor(authCrm);
  }
}
