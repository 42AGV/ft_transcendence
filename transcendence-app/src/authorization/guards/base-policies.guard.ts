import { AnyMongoAbility } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CaslAbilityFactory,
  Subject,
  SubjectCtors,
} from '../casl-ability.factory';
import { AuthorizationService } from '../authorization.service';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { SET_SUBJECTS_KEY } from '../decorators/set-subjects.decorator';
import { Request } from 'express';
import { CONFIG_PARAM_KEY } from '../decorators/configure-param.decorator';

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

  abstract getAbilityFromRequest(
    req: Request,
    param?: string,
  ): Promise<AnyMongoAbility>;

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        ctx.getHandler(),
      ) || [];
    const request: Request =
      ctx.getType() === 'http'
        ? ctx.switchToHttp().getRequest()
        : ctx.switchToWs().getClient().request;
    const param =
      this.reflector.get<string>(CONFIG_PARAM_KEY, ctx.getHandler()) ||
      'chatroomId';
    const ability = await this.getAbilityFromRequest(request, param);
    const subjects: SubjectCtors[] =
      this.reflector.get<SubjectCtors[]>(SET_SUBJECTS_KEY, ctx.getHandler()) ||
      [];
    if (subjects.length) {
      const body = request.body;
      let subjectsAsObj: Subject[] = [];
      if (Array.isArray(body)) {
        subjectsAsObj = subjects.map((Ctor, i) => new Ctor(body[i]));
      } else {
        subjectsAsObj = subjects.map((Ctor) => new Ctor(body));
      }
      return policyHandlers.every((handler, i) =>
        this.execPolicyHandler(handler, ability, subjectsAsObj[i]),
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
