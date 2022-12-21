import { AnyMongoAbility } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';

export interface IPolicyHandler {
  handle(ability: AnyMongoAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

@Injectable()
export abstract class PoliciesGuard implements CanActivate {
  protected constructor(
    protected reflector: Reflector,
    protected caslAbilityFactory: CaslAbilityFactory,
    protected readonly authorizationService: AuthorizationService,
  ) {}

  abstract getAbilityFromContext(
    ctx: ExecutionContext,
  ): Promise<AnyMongoAbility>;

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        ctx.getHandler(),
      ) || [];

    const ability = await this.getAbilityFromContext(ctx);

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
