import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { GlobalPoliciesGuard } from './guards/global-policies.guard';
import { CheckPolicies } from './decorators/policies.decorator';
import { Action } from '../shared/enums/action.enum';
import {
  UserToRole,
} from './infrastructure/db/user-to-role.entity';
import { AuthorizationService } from './authorization.service';

@Controller('authorization')
@UseGuards(AuthenticatedGuard, GlobalPoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Read, UserToRole))
@ApiTags('authorization')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Add a role to a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addRole(@Body() roleObj: UserToRole): Promise<void> {
    await this.authorizationService.addUserToRole(roleObj);
  }
}
