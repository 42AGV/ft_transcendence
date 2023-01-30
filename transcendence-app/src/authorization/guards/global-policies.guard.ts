import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { PoliciesGuard } from './base-policies.guard';
import { UserWithAuthorization } from '../infrastructure/db/user-with-authorization.entity';
import { Request } from 'express';

@Injectable()
export class GlobalPoliciesGuard extends PoliciesGuard {
  constructor(
    reflector: Reflector,
    caslAbilityFactory: CaslAbilityFactory,
    authorizationService: AuthorizationService,
  ) {
    super(reflector, caslAbilityFactory, authorizationService);
  }
  override async getAbilityFromRequest(req: Request, param?: string) {
    void param;
    const authId = req.user.id;
    const userWithAuthorization: UserWithAuthorization =
      await this.authorizationService.getUserWithAuthorizationFromId(authId);
    return this.caslAbilityFactory.defineAbilitiesFor(userWithAuthorization);
  }
}
