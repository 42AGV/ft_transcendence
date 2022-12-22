import { AnyMongoAbility } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CaslAbilityFactory,
  Subject,
  SubjectAsString,
  SubjectsByKey,
} from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { SET_SUBJECTS_KEY } from '../decorators/set-subjects.decorator';

interface IPolicyHandler {
  handle(ability: AnyMongoAbility, subject?: Subject): boolean;
}

type PolicyHandlerCallback = (
  ability: AnyMongoAbility,
  subject?: Subject,
) => boolean;

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
    const subjects: SubjectAsString[] =
      this.reflector.get<SubjectAsString[]>(
        SET_SUBJECTS_KEY,
        ctx.getHandler(),
      ) || [];
    if (subjects.length) {
      const body = ctx.switchToHttp().getRequest().body;
      let objs: unknown[] = [];
      if (Array.isArray(body)) {
        objs = subjects.map((ctor, i) => new SubjectsByKey[ctor](body[i]));
      } else {
        objs = subjects.map((ctor) => new SubjectsByKey[ctor](body));
      }
      return policyHandlers.every((handler, i) =>
        this.execPolicyHandler(handler, ability, objs[i] as Subject),
      );
    }
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }
  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AnyMongoAbility,
    subject?: Subject,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, subject);
    }
    return handler.handle(ability, subject);
  }
}
