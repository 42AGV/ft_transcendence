import { AnyMongoAbility } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { AuthorizationService } from '../authorization.service';
import { PolicyHandler } from "./crm-policies-guard.service";

@Injectable()
export class GlobalPoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        ctx.getHandler(),
      ) || [];

    const authId = ctx.switchToHttp().getRequest().user.id;
    const authCrm =
      await this.authorizationService.getUserWithAuthorizationFromId(authId);

    const ability = await this.caslAbilityFactory.defineAbilitiesFor(authCrm);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AnyMongoAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
