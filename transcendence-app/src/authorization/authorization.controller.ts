import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { GlobalPoliciesGuard } from './guards/global-policies.guard';
import { CheckPolicies } from './decorators/policies.decorator';
import { Action } from '../shared/enums/action.enum';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { AuthorizationService } from './authorization.service';
import { CreateUserToRoleDto } from './dto/create-user-to-role.dto';

@Controller('authorization')
@UseGuards(AuthenticatedGuard, GlobalPoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Read, UserToRole))
@ApiTags('authorization')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('role')
  @ApiCreatedResponse({ description: 'Create a new role', type: UserToRole })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addRole(@Body() roleObj: CreateUserToRoleDto): Promise<UserToRole> {
    const uToR = await this.authorizationService.addUserToRole({
      id: roleObj.userId,
      role: roleObj.role,
    });
    return uToR;
  }
}
