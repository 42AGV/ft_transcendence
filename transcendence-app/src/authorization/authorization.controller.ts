import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { Action } from '../shared/enums/action.enum';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { AuthorizationService } from './authorization.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { GlobalAuthUserPipe } from './decorators/global-auth-user.pipe';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';
import { User as GetUser } from '../user/decorators/user.decorator';
import { GlobalPoliciesGuard } from './guards/global-policies.guard';
import { CheckPolicies } from './decorators/policies.decorator';

@Controller('authorization')
@UseGuards(AuthenticatedGuard, GlobalPoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Read, UserToRole))
@ApiTags('authorization')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post('role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Add a role to a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addRole(
    @Body() roleObj: UserToRole,
    @GetUser('id', GlobalAuthUserPipe)
    authUser: UserWithAuthorization | null,
  ): Promise<void> {
    if (!authUser) {
      throw new UnprocessableEntityException();
    }
    const ability = await this.caslAbilityFactory.defineAbilitiesFor(authUser);
    if (ability.cannot(Action.Create, roleObj)) {
      throw new UnauthorizedException();
    }
    await this.authorizationService.addUserToRole(roleObj);
  }
}
